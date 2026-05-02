"use client"

import * as React from 'react'
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Copy, Check, ChevronDown, ChevronUp, X, ArrowRight, ArrowLeft, CalendarDays, Megaphone, Loader2 } from 'lucide-react'
import { useNotification } from "@/components/notifications"
import { useGroqCaptionGenerator, normalizeCaption } from "@/hooks/use-groq-caption-generator"
import { useBusiness } from "@/context/BusinessContext"

// --- Constants & Types -------------------------------------------------
const SUPPORTED_PLATFORMS = ["Instagram", "Facebook"]

const DEFAULT_HASHTAGS = [
  "#EarthDay",
  "#EarthDay2026",
  "#Environmental",
  "#CoffeeShop",
  "#CoffeeLover",
  "#SpecialtyCoffee",
  "#LocalCoffee",
  "#SmallBusiness",
  "#SupportLocal",
]

type InputData = {
  holidayName: string
  date: string
  description: string
}

// --- Small presentational components ----------------------------------
function FormField({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label className="flex items-center gap-2">{label}</Label>
      {children}
    </div>
  )
}

function HashtagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <Badge key={t} variant="secondary" className="bg-white text-blue-600 hover:bg-white font-normal hover:text-blue-700 border-[#e2e8f0]">
          {t}
        </Badge>
      ))}
    </div>
  )
}

function PlatformSelector({ platforms, selected, onToggle }: { platforms: string[]; selected: string[]; onToggle: (p: string) => void }) {
  return (
    <div className="space-y-3">
      {platforms.map((platform) => {
        const isSelected = selected.includes(platform)
        return (
          <div
            key={platform}
            className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-50/30' : 'border-transparent hover:border-border bg-slate-50'}`}
            onClick={() => onToggle(platform)}
          >
            <div className="flex items-center gap-3">
              <span className={`font-medium text-sm ${isSelected ? 'text-blue-600' : 'text-slate-500'}`}>{platform}</span>
            </div>
            {isSelected && <Check className="h-4 w-4 text-blue-600" />}
          </div>
        )
      })}
    </div>
  )
}

// --- Main component ---------------------------------------------------
export function CampaignGeneratorModal({ children }: { children: React.ReactElement }): React.ReactElement {
  const { addNotification } = useNotification()
  // UI state
  const [open, setOpen] = useState(false)

  // Form state
  const [inputData, setInputData] = useState<InputData>({
    holidayName: "Earth Day",
    date: "Apr 22, 2026",
    description: "Celebrate sustainability and eco-friendly practices",
  })
  const [promoDetails, setPromoDetails] = useState("")
  const [brandVoice, setBrandVoice] = useState("Friendly, approachable, and engaging")

  // App context / generation
  const { profile, isLoading: isProfileLoading } = useBusiness()
  const { isGenerating, generateCaption } = useGroqCaptionGenerator()

  // Result state
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([SUPPORTED_PLATFORMS[0]])
  const [generatedCaption, setGeneratedCaption] = useState<string | null>(null)
  const [generatedCaptionsHistory, setGeneratedCaptionsHistory] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  // --- Helpers ---------------------------------------------------------
  const getActivePlatform = () => selectedPlatforms[0] || SUPPORTED_PLATFORMS[0]

  const resetState = () => {
    setGeneratedCaption(null)
    setGeneratedCaptionsHistory([])
    setPromoDetails("")
    setBrandVoice("Friendly, approachable, and engaging")
    setSelectedPlatforms([SUPPORTED_PLATFORMS[0]])
  }

  const handleClose = () => {
    setOpen(false)
    // allow dialog close animation before clearing heavy state
    setTimeout(resetState, 300)
  }

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(platform)) {
        if (prev.length === 1) return prev // never allow zero selection
        return prev.filter((p) => p !== platform)
      }
      return [...prev, platform]
    })
  }

  const handleCopy = () => {
    if (!generatedCaption) return
    const fullText = `${generatedCaption}\n\n${DEFAULT_HASHTAGS.join(' ')}`
    navigator.clipboard.writeText(fullText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // centralize generation logic
  const handleGenerate = async (e?: React.FormEvent<HTMLFormElement>, isRegenerate = false) => {
    if (e) e.preventDefault()

    try {
      const previousCaptions = isRegenerate ? [...generatedCaptionsHistory, generatedCaption || ''].filter(Boolean) : []

      if (!profile?.name || !profile?.type) {
        addNotification('Please complete your business profile before generating captions.', 'error')
        return
      }

      const nextCaption = await generateCaption({
        payload: {
          holidayName: inputData.holidayName,
          eventDate: inputData.date,
          businessName: profile.name,
          businessType: profile.type,
          businessNiche: promoDetails || profile.description || profile.type || 'General',
          tone: brandVoice || profile.tone || 'Friendly',
          targetAudience: profile.targetAudience || 'Customers',
          platform: getActivePlatform(),
        },
        previousCaptions,
      })

      if (!nextCaption) {
        console.warn('No caption generated')
        if (!generatedCaption) setGeneratedCaption('Unable to generate a caption right now. Please try again.')
        return
      }

      setGeneratedCaption(nextCaption)
      setGeneratedCaptionsHistory((prev) => {
        const newHistory = [...prev, nextCaption]
        const unique = newHistory.filter((caption, index, self) => index === self.findIndex((c) => normalizeCaption(c) === normalizeCaption(caption)))
        return unique.slice(-10)
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate caption'
      addNotification(message, 'error')
      if (!generatedCaption) setGeneratedCaption('Unable to generate a caption right now. Please try again.')
    }
  }

  // --- Render ----------------------------------------------------------
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose()
        else setOpen(true)
      }}
    >
      <DialogTrigger render={children} />
      <DialogContent className={!generatedCaption ? 'sm:max-w-[550px]' : 'max-w-5xl p-0 gap-0 overflow-hidden bg-slate-50/50'}>
        {!generatedCaption ? (
          <form onSubmit={handleGenerate} className="flex flex-col gap-4 p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Generate AI Campaign
              </DialogTitle>
              <DialogDescription>Configure the parameters to create cross-platform copy instantly.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <FormField label={<><CalendarDays className="h-4 w-4" /> Holiday Focus</>}>
                <Input id="holidayName" value={inputData.holidayName} onChange={(e) => setInputData((p) => ({ ...p, holidayName: e.target.value }))} required />
              </FormField>

              <FormField label={<><Megaphone className="h-4 w-4" /> Promotion Details</>}>
                <Textarea id="promoDetails" placeholder="e.g. We are offering 20% off storewide and early access for VIPs." value={promoDetails} onChange={(e) => setPromoDetails(e.target.value)} className="h-20" />
              </FormField>

              <FormField label={"Custom Instructions / Tone"}>
                <Input id="brandVoice" placeholder="e.g. Excited with emojis, highly professional" value={brandVoice} onChange={(e) => setBrandVoice(e.target.value)} className="h-9" />
              </FormField>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
              <Button type="submit" disabled={isGenerating || isProfileLoading || !profile?.name || !profile?.type}>
                {isGenerating ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating via Groq...</>
                ) : isProfileLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading profile...</>
                ) : (
                  'Create Posts'
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="flex flex-col max-h-[90vh] overflow-y-auto">
            {/* Top Banner */}
            <div className="bg-violet-600 text-white p-6 md:p-8 m-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <CalendarDays className="h-6 w-6" />
                <h2 className="text-2xl font-bold m-0">{inputData.holidayName}</h2>
                <Badge variant="secondary" className="bg-white/20 hover:bg-white/20 font-medium text-white border-0">{inputData.date}</Badge>
              </div>
              <p className="text-white/80">{inputData.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 p-4 pt-0">
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2 text-foreground">
                      <Sparkles className="h-4 w-4 text-violet-600" /> AI-Generated Caption
                    </h3>
                    <Button variant="secondary" size="sm" className="h-8 bg-violet-100 text-violet-700 hover:bg-violet-200" onClick={() => handleGenerate(undefined, true)} disabled={isGenerating}>
                      {isGenerating ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Sparkles className="h-3 w-3 mr-1" />} Regenerate
                    </Button>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 mb-4 border text-sm text-foreground/90">
                    {isGenerating ? <div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div> : <p>{generatedCaption}</p>}
                  </div>

                  <div className="bg-[#f0f4f8] rounded-lg p-4 mb-4">
                    <p className="text-xs text-muted-foreground mb-2">Suggested Hashtags:</p>
                    <HashtagList tags={DEFAULT_HASHTAGS} />
                  </div>

                  <Button variant="secondary" className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700" onClick={handleCopy}>
                    {copied ? <Check className="h-4 w-4 mr-2 text-green-600" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? 'Copied!' : 'Copy Caption + Hashtags'}
                  </Button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-5">
                  <h3 className="font-semibold mb-4 text-foreground">Select Platforms</h3>
                  <PlatformSelector platforms={SUPPORTED_PLATFORMS} selected={selectedPlatforms} onToggle={handlePlatformChange} />
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 shadow-md text-base">
                    <CalendarDays className="mr-2 h-5 w-5" /> Schedule for {inputData.date.split(',')[0]}
                  </Button>
                  <Button variant="outline" className="w-full py-6 text-base" onClick={handleClose}>Back to Dashboard</Button>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl">
                <div className="mb-2 px-2">
                  <h3 className="font-bold text-foreground">Post Preview</h3>
                  <p className="text-xs text-muted-foreground">How your post will look</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border overflow-hidden max-w-sm mx-auto">
                  <div className="flex items-center gap-3 p-4 border-b">
                    <div className="h-10 w-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold">{(profile?.name?.[0] || 'B').toUpperCase()}</div>
                    <div>
                      <p className="text-sm font-bold leading-none">{profile?.name || 'Your Business'}</p>
                      <p className="text-xs text-muted-foreground mt-1">{profile?.location || 'Your Location'}</p>
                    </div>
                  </div>

                  <div className="aspect-square bg-violet-100 flex flex-col items-center justify-center text-violet-400 p-6 text-center">
                    <Sparkles className="h-12 w-12 mb-4" />
                    <p className="font-medium text-violet-700">Your Holiday Image</p>
                    <p className="text-xs text-violet-500 mt-1">Add a festive photo here</p>
                  </div>

                  <div className="p-4">
                    <p className="text-sm">
                      <span className="font-bold mr-2">{profile?.name || 'Your Business'}</span>
                      {!isGenerating ? generatedCaption : <span className="text-muted-foreground">Loading caption...</span>}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-x-1 gap-y-1">
                      {!isGenerating && DEFAULT_HASHTAGS.map((tag) => <span key={tag} className="text-blue-600 text-xs hover:underline cursor-pointer">{tag}</span>)}
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase mt-4">{inputData.date}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

