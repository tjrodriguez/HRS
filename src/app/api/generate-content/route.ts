import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { createClient } from '@/utils/supabase/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const RESPONSE_CACHE_TTL_MS = 15 * 60 * 1000;
const MAX_COMPLETION_TOKENS = Number(process.env.GROQ_MAX_COMPLETION_TOKENS || '512');
const CAPTION_RETRY_LIMIT = Math.min(5, Math.max(1, Number(process.env.GROQ_CAPTION_RETRY_LIMIT || '3')));
let missingCacheTableLogged = false;

type CachedResponse = {
	expiresAt: number;
	payload: unknown;
};

const responseCache = new Map<string, CachedResponse>();

interface ContentRequestBody {
	mode?: 'full' | 'caption';
	stream?: boolean;
	holiday?: string;
	holidayDescription?: string;
	businessType?: string;
	businessName?: string;
	businessDescription?: string;
	targetAudience?: string;
	location?: string;
	eventDate?: string;
	holidayName?: string;
	businessNiche?: string;
	tone?: string;
	platform?: string;
	previousCaptions?: string[];
	strictUniqueness?: boolean;
}

interface EngagementPrediction {
	reach: { min: number; max: number };
	likes: { min: number; max: number };
	comments: { min: number; max: number };
	shares: { min: number; max: number };
}

interface PlatformTips {
	instagram: string;
	facebook: string;
	twitter: string;
}

export async function POST(request: NextRequest) {
	try {
		const body: ContentRequestBody = await request.json();
		const supabase = await createClient();
		const { data: authData } = await supabase.auth.getUser();
		const userId = authData.user?.id ?? null;

		const {
			mode = 'full',
			stream = false,
			holiday,
			holidayDescription,
			businessType,
			businessName,
			businessDescription,
			targetAudience,
			location,
			eventDate,
			holidayName,
			businessNiche,
			tone,
			platform,
			previousCaptions,
			strictUniqueness = false,
		} = body;

		const normalizedPreviousCaptions = Array.isArray(previousCaptions)
			? previousCaptions.map((caption) => String(caption || '').trim()).filter(Boolean)
			: [];

		const cacheKey = buildCacheKey({
			mode,
			stream,
			holiday,
			holidayDescription,
			businessType,
			businessName,
			businessDescription,
			targetAudience,
			location,
			eventDate,
			holidayName,
			businessNiche,
			tone,
			platform,
			previousCaptions: normalizedPreviousCaptions,
			strictUniqueness,
		});

		// Skip cache for regeneration requests (when previousCaptions are provided)
		const isRegenerationRequest = normalizedPreviousCaptions.length > 0;

		if (!stream && !isRegenerationRequest) {
			const cachedResponse = getCachedResponse(cacheKey);
			if (cachedResponse) {
				return NextResponse.json({ ...cachedResponse, cached: true });
			}
		}

		if (userId && !stream && !isRegenerationRequest) {
			const dbCachedResponse = await getCachedResponseFromDatabase(supabase, userId, cacheKey);
			if (dbCachedResponse) {
				cacheResponse(cacheKey, dbCachedResponse);
				return NextResponse.json({ ...dbCachedResponse, cached: true, persistentCache: true });
			}
		}

		if (!GROQ_API_KEY) {
			return NextResponse.json(
				{ error: 'AI generation is unavailable. GROQ_API_KEY is not configured.' },
				{ status: 503 }
			);
		}

		const groq = new Groq({ apiKey: GROQ_API_KEY });

		if (mode === 'caption') {
			if (!holidayName || !businessName || !businessType || !tone) {
				return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
			}

			const disallowedCaptions = [...normalizedPreviousCaptions];
			let usedFallback = false;

			console.log('Generating caption for:', {
				holidayName,
				businessName,
				previousCaptions: normalizedPreviousCaptions.length,
				strictUniqueness,
				retryLimit: CAPTION_RETRY_LIMIT,
			});

			if (stream && !isRegenerationRequest) {
				const streamSystemPrompt = buildCaptionSystemPrompt({
					hasPreviousCaptions: disallowedCaptions.length > 0,
					strictUniqueness,
					retryAttempt: 0,
				});
				const streamUserPrompt = buildCaptionUserPrompt({
					holidayName,
					eventDate,
					businessName,
					businessType,
					businessNiche,
					tone,
					targetAudience,
					platform,
					previousCaptions: disallowedCaptions,
					retryAttempt: 0,
				});

				const streamedCompletion = await groq.chat.completions.create({
					model: GROQ_MODEL,
					messages: [
						{
							role: 'system',
							content: streamSystemPrompt,
						},
						{
							role: 'user',
							content: streamUserPrompt,
						},
					],
					temperature: 1,
					top_p: 1,
					max_completion_tokens: Math.min(MAX_COMPLETION_TOKENS, 256),
					stream: true,
				});

				const encoder = new TextEncoder();
				const readableStream = new ReadableStream({
					async start(controller) {
						try {
							for await (const chunk of streamedCompletion) {
								const delta = chunk.choices?.[0]?.delta?.content || '';
								if (delta) {
									controller.enqueue(encoder.encode(delta));
								}
							}
							controller.close();
						} catch (streamError) {
							console.error('Groq caption stream failed:', streamError);
							controller.error(streamError);
						}
					},
				});

				return new NextResponse(readableStream, {
					headers: {
						'Content-Type': 'text/plain; charset=utf-8',
						'Cache-Control': 'no-store',
					},
				});
			}

			let selectedCaption: string | null = null;
			let parsingFailures = 0;
			let duplicateFailures = 0;

			for (let attempt = 0; attempt < CAPTION_RETRY_LIMIT; attempt += 1) {
				const shouldEnforceStrictUniqueness = strictUniqueness || isRegenerationRequest || attempt > 0;
				const systemPrompt = buildCaptionSystemPrompt({
					hasPreviousCaptions: disallowedCaptions.length > 0,
					strictUniqueness: shouldEnforceStrictUniqueness,
					retryAttempt: attempt,
				});

				const userPrompt = buildCaptionUserPrompt({
					holidayName,
					eventDate,
					businessName,
					businessType,
					businessNiche,
					tone,
					targetAudience,
					platform,
					previousCaptions: disallowedCaptions,
					retryAttempt: attempt,
				});

				const completion = await groq.chat.completions.create({
					model: GROQ_MODEL,
					messages: [
						{
							role: 'system',
							content: systemPrompt,
						},
						{
							role: 'user',
							content: userPrompt,
						},
					],
					temperature: Math.min(1.0, 0.9 + attempt * 0.15),
					top_p: 1,
					max_completion_tokens: Math.min(MAX_COMPLETION_TOKENS, 256),
					stream: false,
				});

				const contentText = completion.choices?.[0]?.message?.content || '';
				console.log(
					`Caption generation attempt ${attempt + 1}/${CAPTION_RETRY_LIMIT} returned raw response:`,
					contentText
				);

				const parsedCaptions = parseCaptionArray(contentText);
				if (!parsedCaptions || parsedCaptions.length === 0) {
					parsingFailures += 1;
					console.warn(
						`Caption generation parse failure on attempt ${attempt + 1}/${CAPTION_RETRY_LIMIT}. Retrying with stricter prompt.`
					);
					continue;
				}

				const candidateCaption = parsedCaptions.map((caption) => String(caption || '').trim()).find(Boolean);
				if (!candidateCaption) {
					parsingFailures += 1;
					console.warn(
						`Caption generation produced empty caption on attempt ${attempt + 1}/${CAPTION_RETRY_LIMIT}. Retrying.`
					);
					continue;
				}

				if (isCaptionTooSimilar(candidateCaption, disallowedCaptions)) {
					duplicateFailures += 1;
					disallowedCaptions.push(candidateCaption);
					console.warn(
						`Caption generation produced a duplicate/similar caption on attempt ${attempt + 1}/${CAPTION_RETRY_LIMIT}. Retrying.`
					);
					continue;
				}

				selectedCaption = candidateCaption;
				break;
			}

			if (!selectedCaption) {
				usedFallback = true;
				selectedCaption = getDistinctFallbackCaption({
					holidayName,
					eventDate,
					businessName,
					businessType,
					targetAudience,
					platform,
					previousCaptions: disallowedCaptions,
				});

				console.warn('Caption generation fell back after retries.', {
					attempts: CAPTION_RETRY_LIMIT,
					parsingFailures,
					duplicateFailures,
					isRegenerationRequest,
				});
			}

			const payload = {
				success: true,
				captions: [selectedCaption],
				retriesAttempted: CAPTION_RETRY_LIMIT,
				isFallback: usedFallback,
			};

			if (!isRegenerationRequest) {
				cacheResponse(cacheKey, payload);
			}
			if (userId && !isRegenerationRequest) {
				await storeCachedResponseInDatabase(supabase, userId, cacheKey, 'caption', payload);
			}

			return NextResponse.json(payload);
		}

		if (!holiday || !businessType || !businessName || !targetAudience || !location) {
			return NextResponse.json(
				{ error: 'Missing required fields: holiday, businessType, businessName, targetAudience, location' },
				{ status: 400 }
			);
		}

		// Full mode: AI model is only used for caption generation.
		// Engagement predictions and platform tips use fallback values without AI calls.
		const fallbackPayload = buildFullModeFallbackPayload({
			holiday,
			businessName,
			businessType,
			targetAudience,
			location,
			eventDate,
		});

		cacheResponse(cacheKey, fallbackPayload);
		if (userId) {
			await storeCachedResponseInDatabase(supabase, userId, cacheKey, 'full', fallbackPayload);
		}

		return NextResponse.json(fallbackPayload);
	} catch (error) {
		console.error('Error in generate-content route:', error);
		return NextResponse.json(
			{ error: 'Failed to generate content', details: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		);
	}
}

function parseCaptionArray(content: string): string[] | null {
	const normalized = (content || '').replace(/^```json\s*|^```\s*|\s*```$/gim, '').trim();
	if (!normalized) {
		return null;
	}

	try {
		const parsed = JSON.parse(normalized.replace(/,\s*([}\]])/g, '$1'));
		if (!Array.isArray(parsed)) {
			return null;
		}

		const captions = parsed.map((item) => String(item || '').trim()).filter(Boolean);
		return captions.length > 0 ? captions : null;
	} catch {
		return null;
	}
}

function parseGroqJsonObject(content: string): Record<string, unknown> | null {
	const normalized = (content || '').replace(/^```json\s*|^```\s*|\s*```$/gim, '').trim();
	const objectMatch = normalized.match(/\{[\s\S]*\}/);
	const candidates = [normalized, objectMatch?.[0] || ''];

	for (const candidate of candidates) {
		if (!candidate) continue;
		try {
			const parsed = JSON.parse(candidate.replace(/,\s*([}\]])/g, '$1'));
			if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
				return parsed as Record<string, unknown>;
			}
		} catch {
			// continue trying other candidate
		}
	}

	return null;
}

function buildCaptionSystemPrompt({
	hasPreviousCaptions,
	strictUniqueness,
	retryAttempt,
}: {
	hasPreviousCaptions: boolean;
	strictUniqueness: boolean;
	retryAttempt: number;
}) {
	const retryInstruction = retryAttempt > 0
		? ` Retry attempt ${retryAttempt + 1}: drastically change phrasing, sentence structure, and opening hook.`
		: '';
	const uniquenessInstruction = strictUniqueness || hasPreviousCaptions
		? 'Do not repeat or paraphrase previous captions. If similar, rewrite until clearly distinct.'
		: 'Keep wording fresh and concise.';

	return `You are an enthusiastic Holiday Event Assistant. Generate exactly ONE short festive caption under 150 characters. ${uniquenessInstruction}${retryInstruction} Output must be strictly valid JSON array with one string and no extra text, e.g. ["caption"].`;
}

function buildCaptionUserPrompt({
	holidayName,
	eventDate,
	businessName,
	businessType,
	businessNiche,
	tone,
	targetAudience,
	platform,
	previousCaptions,
	retryAttempt,
}: {
	holidayName?: string;
	eventDate?: string;
	businessName?: string;
	businessType?: string;
	businessNiche?: string;
	tone?: string;
	targetAudience?: string;
	platform?: string;
	previousCaptions: string[];
	retryAttempt: number;
}) {
	const previousCaptionBlock = previousCaptions.length > 0
		? `\nPrevious captions to avoid exactly or semantically:\n${previousCaptions.slice(-8).map((caption) => `- "${caption}"`).join('\n')}`
		: '';
	const retryBlock = retryAttempt > 0
		? '\nRetry guidance: use a different emotional angle and different emoji set than prior attempts.'
		: '';

	return `Event: ${holidayName}\nDate: ${eventDate || 'upcoming date'}\nBusiness: ${businessName}\nType: ${businessType}\nNiche: ${businessNiche || 'general'}\nTone: ${tone}\nAudience: ${targetAudience || 'general customers'}\nPlatform: ${platform || 'Instagram'}${previousCaptionBlock}${retryBlock}`;
}

function normalizeCaptionForCompare(caption: string) {
	return caption
		.toLowerCase()
		.replace(/[^a-z0-9\s]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function tokenizeCaption(caption: string) {
	return normalizeCaptionForCompare(caption)
		.split(' ')
		.filter((token) => token.length > 2);
}

function jaccardSimilarity(left: string, right: string) {
	const leftSet = new Set(tokenizeCaption(left));
	const rightSet = new Set(tokenizeCaption(right));

	if (leftSet.size === 0 || rightSet.size === 0) {
		return 0;
	}

	let intersection = 0;
	for (const token of leftSet) {
		if (rightSet.has(token)) {
			intersection += 1;
		}
	}

	const union = new Set([...leftSet, ...rightSet]).size;
	return union === 0 ? 0 : intersection / union;
}

function isCaptionTooSimilar(candidate: string, previousCaptions: string[]) {
	const normalizedCandidate = normalizeCaptionForCompare(candidate);

	return previousCaptions.some((prior) => {
		const normalizedPrior = normalizeCaptionForCompare(prior);
		if (!normalizedPrior) return false;
		if (normalizedCandidate === normalizedPrior) return true;

		const similarity = jaccardSimilarity(candidate, prior);
		return similarity >= 0.72;
	});
}

function getDistinctFallbackCaption({
	holidayName,
	eventDate,
	businessName,
	businessType,
	targetAudience,
	platform,
	previousCaptions,
}: {
	holidayName?: string;
	eventDate?: string;
	businessName?: string;
	businessType?: string;
	targetAudience?: string;
	platform?: string;
	previousCaptions: string[];
}) {
	const templates = [
		`🎊 ${businessName || 'We'} are celebrating ${holidayName || 'this holiday'} on ${eventDate || 'the big day'} with a fresh surprise for ${targetAudience || 'our community'}!`,
		`✨ ${holidayName || 'Holiday'} is almost here! ${businessName || 'Our team'} is preparing something special for ${targetAudience || 'you'} on ${platform || 'social'}.`,
		`🎉 New ${holidayName || 'holiday'} vibes at ${businessName || 'our business'}! ${businessType || 'offers'} made for ${targetAudience || 'you'} land ${eventDate || 'soon'}.`,
		`🌟 ${holidayName || 'Holiday'} countdown starts now. ${businessName || 'We'} have limited-time ${businessType || 'deals'} for ${targetAudience || 'our customers'}!`,
	];

	for (const template of templates) {
		if (!isCaptionTooSimilar(template, previousCaptions)) {
			return template;
		}
	}

	const uniqueSuffix = `${Date.now().toString(36).slice(-4)}`;
	return `${getTemplateCaption({ holidayName, businessName, businessType, targetAudience, platform, eventDate })} #${uniqueSuffix}`;
}

function getTemplateCaption({
	holidayName,
	businessName,
	businessType,
	targetAudience,
	platform,
	eventDate,
}: {
	holidayName?: string;
	businessName?: string;
	businessType?: string;
	targetAudience?: string;
	platform?: string;
	eventDate?: string;
}) {
	return `🎉 ${holidayName || 'Holiday'} on ${eventDate || 'soon'}! ${businessName || 'Our team'} has ${businessType || 'offers'} for ${targetAudience || 'you'} on ${platform || 'social'} ✨`;
}

function buildFallbackEmail({
	holiday,
	businessName,
	businessType,
	targetAudience,
	location,
}: {
	holiday: string;
	businessName: string;
	businessType: string;
	targetAudience: string;
	location: string;
}) {
	return `Subject: ${holiday} updates from ${businessName}\n\nHi ${targetAudience},\n\n${businessName} is preparing ${holiday} offers tailored for ${businessType} customers in ${location}. Stay tuned for fresh updates.`;
}

function buildFullModeFallbackPayload({
	holiday,
	businessName,
	businessType,
	targetAudience,
	location,
	eventDate,
}: {
	holiday: string;
	businessName: string;
	businessType: string;
	targetAudience: string;
	location: string;
	eventDate?: string;
}) {
	return {
		instagram: [
			getTemplateCaption({
				holidayName: holiday,
				businessName,
				businessType,
				targetAudience,
				platform: 'Instagram',
				eventDate,
			}),
		],
		email: buildFallbackEmail({ holiday, businessName, businessType, targetAudience, location }),
		engagement: getDefaultEngagement(),
		platformTips: getDefaultPlatformTips(),
		isFallback: true,
	};
}

function getDefaultEngagement(): EngagementPrediction {
	return {
		reach: { min: 2500, max: 4000 },
		likes: { min: 150, max: 300 },
		comments: { min: 20, max: 40 },
		shares: { min: 25, max: 50 },
	};
}

function getDefaultPlatformTips(): PlatformTips {
	return {
		instagram: 'Use hashtags and post at peak hours (9-11 AM or 7-9 PM).',
		facebook: 'Ask a simple question to invite comments and shares.',
		twitter: 'Keep it short, add one hook, and engage quickly with replies.',
	};
}

function buildCacheKey(payload: Record<string, unknown>) {
	return createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

function getCachedResponse(cacheKey: string) {
	const cached = responseCache.get(cacheKey);
	if (!cached) return null;
	if (Date.now() > cached.expiresAt) {
		responseCache.delete(cacheKey);
		return null;
	}
	return cached.payload;
}

function cacheResponse(cacheKey: string, payload: unknown) {
	responseCache.set(cacheKey, {
		expiresAt: Date.now() + RESPONSE_CACHE_TTL_MS,
		payload,
	});
}

async function getCachedResponseFromDatabase(
	supabaseClient: Awaited<ReturnType<typeof createClient>>,
	userId: string,
	cacheKey: string,
) {
	const { data, error } = await supabaseClient
		.from('content_generation_cache')
		.select('payload, expires_at')
		.eq('user_id', userId)
		.eq('cache_key', cacheKey)
		.maybeSingle();

	if (error) {
		if (error.code === 'PGRST205') {
			if (!missingCacheTableLogged) {
				console.warn('Persistent cache table missing. Run migration for content_generation_cache to enable DB caching.');
				missingCacheTableLogged = true;
			}
			return null;
		}
		console.error('Error reading persistent generation cache:', error);
		return null;
	}

	if (!data || new Date(data.expires_at).getTime() <= Date.now()) {
		return null;
	}

	return data.payload;
}

async function storeCachedResponseInDatabase(
	supabaseClient: Awaited<ReturnType<typeof createClient>>,
	userId: string,
	cacheKey: string,
	mode: 'full' | 'caption',
	payload: unknown,
) {
	const expiresAt = new Date(Date.now() + RESPONSE_CACHE_TTL_MS).toISOString();

	const { error } = await supabaseClient
		.from('content_generation_cache')
		.upsert(
			{
				user_id: userId,
				cache_key: cacheKey,
				mode,
				payload,
				expires_at: expiresAt,
				updated_at: new Date().toISOString(),
			},
			{
				onConflict: 'user_id,cache_key',
			}
		);

	if (error) {
		if (error.code === 'PGRST205') {
			if (!missingCacheTableLogged) {
				console.warn('Persistent cache table missing. Run migration for content_generation_cache to enable DB caching.');
				missingCacheTableLogged = true;
			}
			return;
		}
		console.error('Error storing persistent generation cache:', error);
	}
}

