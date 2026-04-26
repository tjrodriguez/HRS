"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sparkles, CalendarDays, Megaphone, Loader2, Check, Copy } from "lucide-react"
import { toast } from "sonner"
import { useGroqCaptionGenerator } from "@/hooks/use-groq-caption-generator"

// Define simple SVG components for platforms if lucide doesn't export them
const Instagram = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
)

const Facebook = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
)

const Twitter = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
)

export function CampaignGeneratorModal({ children }: { children: React.ReactElement }) {
  const [open, setOpen] = useState(false)
  const [inputData, setInputData] = useState({
    holidayName: "Earth Day",
    date: "Apr 22, 2026",
    description: "Celebrate sustainability and eco-friendly practices"
  })
  const [promoDetails, setPromoDetails] = useState("")
  const [brandVoice, setBrandVoice] = useState("Friendly, approachable, and engaging")

  const [platforms, setPlatforms] = useState({
    instagram: true,
    facebook: false,
    twitter: false,
  })
  
  const [generatedCaption, setGeneratedCaption] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const { isGenerating, generateCaption } = useGroqCaptionGenerator()

  const defaultHashtags = ["#EarthDay", "#EarthDay2026", "#Environmental", "#CoffeeShop", "#CoffeeLover", "#SpecialtyCoffee", "#LocalCoffee", "#SmallBusiness", "#SupportLocal"]

  const getActivePlatform = () => {
    if (platforms.facebook) return "Facebook"
    if (platforms.twitter) return "Twitter"
    return "Instagram"
  }

  const handleGenerate = async (e?: React.FormEvent<HTMLFormElement>, isRegenerate = false) => {
    if (e) e.preventDefault()

    try {
      const nextCaption = await generateCaption({
        payload: {
          holidayName: inputData.holidayName,
          eventDate: inputData.date,
          businessName: "Brew & Bean Coffee Shop",
          businessType: "Coffee Shop",
          businessNiche: promoDetails || "Holiday specials and seasonal coffee",
          tone: brandVoice || "Friendly, approachable, and engaging",
          targetAudience: "Local coffee lovers",
          platform: getActivePlatform(),
        },
        previousCaptions: isRegenerate && generatedCaption ? [generatedCaption] : [],
      })

      if (nextCaption) {
        setGeneratedCaption(nextCaption)
      } else if (!generatedCaption) {
        setGeneratedCaption("Unable to generate a caption right now. Please try again.")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate caption"
      toast.error(errorMessage)
      if (!generatedCaption) {
        setGeneratedCaption("Unable to generate a caption right now. Please try again.")
      }
    }
  }

  const handlePlatformChange = (key: keyof typeof platforms) => {
    // For single select behavior like in the mockup (though checkboxes imply multi, the UI shows a selected state)
    // Let's implement radio-like behavior for the preview just to match the visual exactly,
    // or keep checkboxes but highlight the "active preview" one.
    // Based on mockup, the entire row is selectable. We'll stick to a primary selected platform.
    setPlatforms({ instagram: false, facebook: false, twitter: false, [key]: true })
  }

  const handleCopy = () => {
    if (generatedCaption) {
      const fullText = `${generatedCaption}\n\n${defaultHashtags.join(' ')}`
      navigator.clipboard.writeText(fullText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setTimeout(() => {
      setGeneratedCaption(null)
      setPromoDetails("")
      setBrandVoice("Friendly, approachable, and engaging")
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) { handleClose() } else { setOpen(true) }
    }}>
      <DialogTrigger render={children} />
      <DialogContent className={!generatedCaption ? "sm:max-w-[550px]" : "max-w-5xl p-0 gap-0 overflow-hidden bg-slate-50/50"}>
        
        {!generatedCaption ? (
          <form onSubmit={handleGenerate} className="flex flex-col gap-4 p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Generate AI Campaign
              </DialogTitle>
              <DialogDescription>
                Configure the parameters to create cross-platform copy instantly.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="holidayName" className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" /> Holiday Focus
                </Label>
                <Input 
                  id="holidayName" 
                  value={inputData.holidayName}
                  onChange={(e) => setInputData(prev => ({...prev, holidayName: e.target.value}))}
                  required 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="promoDetails" className="flex items-center gap-2">
                  <Megaphone className="h-4 w-4" /> Promotion Details
                </Label>
                <Textarea 
                  id="promoDetails" 
                  placeholder="e.g. We are offering 20% off storewide and early access for VIPs." 
                  value={promoDetails}
                  onChange={(e) => setPromoDetails(e.target.value)}
                  className="h-20"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="brandVoice">Custom Instructions / Tone</Label>
                <Input 
                  id="brandVoice" 
                  placeholder="e.g. Excited with emojis, highly professional" 
                  value={brandVoice}
                  onChange={(e) => setBrandVoice(e.target.value)}
                  className="h-9"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating via Groq...
                  </>
                ) : (
                  "Create Posts"
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
                <Badge variant="secondary" className="bg-white/20 hover:bg-white/20 font-medium text-white border-0">
                  {inputData.date}
                </Badge>
              </div>
              <p className="text-white/80">{inputData.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 p-4 pt-0">
              {/* Left Column */}
              <div className="space-y-6">
                
                {/* AI-Generated Caption Card */}
                <div className="bg-white rounded-xl shadow-sm border p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2 text-foreground">
                      <Sparkles className="h-4 w-4 text-violet-600" />
                      AI-Generated Caption
                    </h3>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="h-8 bg-violet-100 text-violet-700 hover:bg-violet-200"
                      onClick={() => handleGenerate(undefined, true)}
                      disabled={isGenerating}
                    >
                      {isGenerating ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Sparkles className="h-3 w-3 mr-1" />}
                      Regenerate
                    </Button>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4 mb-4 border text-sm text-foreground/90">
                    {isGenerating ? (
                      <div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                    ) : (
                      <p>{generatedCaption}</p>
                    )}
                  </div>

                  <div className="bg-[#f0f4f8] rounded-lg p-4 mb-4">
                    <p className="text-xs text-muted-foreground mb-2">Suggested Hashtags:</p>
                    <div className="flex flex-wrap gap-2">
                      {defaultHashtags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-white text-blue-600 hover:bg-white font-normal hover:text-blue-700 border-[#e2e8f0]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    variant="secondary" 
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700" 
                    onClick={handleCopy}
                  >
                    {copied ? <Check className="h-4 w-4 mr-2 text-green-600" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? "Copied!" : "Copy Caption + Hashtags"}
                  </Button>
                </div>

                {/* Platforms selection */}
                <div className="bg-white rounded-xl shadow-sm border p-5">
                  <h3 className="font-semibold mb-4 text-foreground">Select Platforms</h3>
                  <div className="space-y-3">
                    <div 
                      className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${platforms.instagram ? 'border-blue-500 bg-blue-50/30' : 'border-transparent hover:border-border bg-slate-50'}`}
                      onClick={() => handlePlatformChange('instagram')}
                    >
                      <div className="flex items-center gap-3">
                        <Instagram className={`h-5 w-5 ${platforms.instagram ? 'text-blue-600' : 'text-slate-500'}`} />
                        <span className="font-medium text-sm">Instagram</span>
                      </div>
                      {platforms.instagram && <Check className="h-4 w-4 text-blue-600" />}
                    </div>

                    <div 
                      className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${platforms.facebook ? 'border-blue-500 bg-blue-50/30' : 'border-transparent hover:border-border bg-slate-50'}`}
                      onClick={() => handlePlatformChange('facebook')}
                    >
                      <div className="flex items-center gap-3">
                        <Facebook className={`h-5 w-5 ${platforms.facebook ? 'text-blue-600' : 'text-slate-500'}`} />
                        <span className="font-medium text-sm">Facebook</span>
                      </div>
                      {platforms.facebook && <Check className="h-4 w-4 text-blue-600" />}
                    </div>

                    <div 
                      className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${platforms.twitter ? 'border-blue-500 bg-blue-50/30' : 'border-transparent hover:border-border bg-slate-50'}`}
                      onClick={() => handlePlatformChange('twitter')}
                    >
                      <div className="flex items-center gap-3">
                        <Twitter className={`h-5 w-5 ${platforms.twitter ? 'text-blue-600' : 'text-slate-500'}`} />
                        <span className="font-medium text-sm">Twitter</span>
                      </div>
                      {platforms.twitter && <Check className="h-4 w-4 text-blue-600" />}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 shadow-md text-base">
                    <CalendarDays className="mr-2 h-5 w-5" />
                    Schedule for {inputData.date.split(',')[0]}
                  </Button>
                  <Button variant="outline" className="w-full py-6 text-base" onClick={handleClose}>
                    Back to Dashboard
                  </Button>
                </div>

              </div>

              {/* Right Column: Preview */}
              <div className="bg-slate-50 rounded-xl">
                <div className="mb-2 px-2">
                  <h3 className="font-bold text-foreground">Post Preview</h3>
                  <p className="text-xs text-muted-foreground">How your post will look</p>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden max-w-sm mx-auto">
                  {/* Social Header */}
                  <div className="flex items-center gap-3 p-4 border-b">
                    <div className="h-10 w-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold">
                      B
                    </div>
                    <div>
                      <p className="text-sm font-bold leading-none">Brew & Bean Coffee Shop</p>
                      <p className="text-xs text-muted-foreground mt-1">San Francisco, CA</p>
                    </div>
                  </div>

                  {/* Image Placeholder */}
                  <div className="aspect-square bg-violet-100 flex flex-col items-center justify-center text-violet-400 p-6 text-center">
                    <Sparkles className="h-12 w-12 mb-4" />
                    <p className="font-medium text-violet-700">Your Holiday Image</p>
                    <p className="text-xs text-violet-500 mt-1">Add a festive photo here</p>
                  </div>

                  {/* Post Content */}
                  <div className="p-4">
                    <p className="text-sm">
                      <span className="font-bold mr-2">Brew & Bean Coffee Shop</span>
                      {!isGenerating ? generatedCaption : <span className="text-muted-foreground">Loading caption...</span>}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-x-1 gap-y-1">
                      {!isGenerating && defaultHashtags.map(tag => (
                        <span key={tag} className="text-blue-600 text-xs hover:underline cursor-pointer">{tag}</span>
                      ))}
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