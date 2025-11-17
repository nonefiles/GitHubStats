'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Copy, Check, Github, Globe, Linkedin, Chrome } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { ThemeToggle } from '@/components/theme-toggle'

const THEMES = [
  'default',
  'transparent',
  'dark',
  'radical',
  'merko',
  'gruvbox',
  'tokyonight',
  'onedark',
  'cobalt',
  'synthwave',
  'highcontrast',
  'dracula',
] as const

const LOCALES = [
  { value: 'en', label: 'English' },
  { value: 'tr', label: 'Türkçe' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'zh-cn', label: '简体中文' },
  { value: 'ja', label: '日本語' },
  { value: 'pt-br', label: 'Português (Brasil)' },
  { value: 'ru', label: 'Русский' },
  { value: 'ko', label: '한국어' },
  { value: 'ar', label: 'العربية' },
] as const

const formSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  theme: z.enum(THEMES),
  locale: z.string(),
  hideBorder: z.boolean(),
  includeAllCommits: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

export default function GitHubStatsCard() {
  const [copiedType, setCopiedType] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('stats')
  const [imageLoadPriority, setImageLoadPriority] = useState<Record<string, boolean>>({
    stats: true,
    languages: false,
    streak: false,
  })
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      theme: 'default',
      locale: 'en',
      hideBorder: false,
      includeAllCommits: false,
    },
  })

  const username = form.watch('username')
  const theme = form.watch('theme')
  const locale = form.watch('locale')
  const hideBorder = form.watch('hideBorder')
  const includeAllCommits = form.watch('includeAllCommits')

  const buildStatsUrl = () => {
    const params = new URLSearchParams()
    if (theme !== 'default') params.append('theme', theme)
    if (locale !== 'en') params.append('locale', locale)
    if (hideBorder) params.append('hide_border', 'true')
    if (includeAllCommits) params.append('include_all_commits', 'true')

    const queryString = params.toString()
    return `https://github-readme-stats.vercel.app/api?username=${username}${queryString ? `&${queryString}` : ''}`
  }

  const buildLanguagesUrl = () => {
    const params = new URLSearchParams()
    if (theme !== 'default') params.append('theme', theme)
    if (locale !== 'en') params.append('locale', locale)
    if (hideBorder) params.append('hide_border', 'true')

    const queryString = params.toString()
    return `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}${queryString ? `&${queryString}` : ''}`
  }

  const buildStreakUrl = () => {
    const params = new URLSearchParams()
    if (theme !== 'default') params.append('theme', theme)
    if (locale !== 'en') params.append('locale', locale)
    if (hideBorder) params.append('hide_border', 'true')

    const queryString = params.toString()
    return `https://streak-stats.demolab.com/?user=${username}${queryString ? `&${queryString}` : ''}`
  }

  const copyToClipboard = async (content: string, type: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedType(type)
    setTimeout(() => setCopiedType(null), 2000)
    toast({
      title: 'Copied!',
      description: `${type} copied to clipboard`,
    })
  }

  const getMarkdown = () => {
    const url = activeTab === 'stats' ? buildStatsUrl() : activeTab === 'languages' ? buildLanguagesUrl() : buildStreakUrl()
    return `![GitHub Stats](${url})`
  }

  const getHTML = () => {
    const url = activeTab === 'stats' ? buildStatsUrl() : activeTab === 'languages' ? buildLanguagesUrl() : buildStreakUrl()
    return `<img src="${url}" alt="GitHub Stats" />`
  }

  const getCurrentUrl = () => {
    return activeTab === 'stats' ? buildStatsUrl() : activeTab === 'languages' ? buildLanguagesUrl() : buildStreakUrl()
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setImageLoadPriority({
      stats: value === 'stats',
      languages: value === 'languages',
      streak: value === 'streak',
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1" />
            <div className="flex-1 flex items-center justify-center gap-3">
              <Github className="w-10 h-10 text-foreground" />
              <h1 className="text-4xl font-bold text-balance">GitHub Stats Card Generator</h1>
            </div>
            <div className="flex-1 flex justify-end">
              <ThemeToggle />
            </div>
          </div>
          <p className="text-muted-foreground text-pretty">
            Create customizable GitHub profile stats cards for your README
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div>
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <Form {...form}>
                  <form className="space-y-6">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GitHub Username</FormLabel>
                          <FormControl>
                            <Input placeholder="octocat" {...field} />
                          </FormControl>
                          <FormDescription>Enter your GitHub username</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="theme"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Theme</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a theme" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {THEMES.map((theme) => (
                                <SelectItem key={theme} value={theme}>
                                  {theme}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>Choose a visual theme</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="locale"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Language</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a language" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {LOCALES.map((locale) => (
                                <SelectItem key={locale.value} value={locale.value}>
                                  {locale.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>Select display language</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="hideBorder"
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Hide border</FormLabel>
                              <FormDescription>Remove the card border</FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="includeAllCommits"
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Count private commits</FormLabel>
                              <FormDescription>Include all commits in stats</FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div>
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="stats">Stats</TabsTrigger>
                    <TabsTrigger value="languages">Top Languages</TabsTrigger>
                    <TabsTrigger value="streak">Streak</TabsTrigger>
                  </TabsList>

                  <TabsContent value="stats" className="space-y-4">
                    {username ? (
                      <>
                        <div className="rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center min-h-[200px]">
                          <img
                            src={buildStatsUrl() || "/placeholder.svg"}
                            alt="GitHub Stats"
                            className="w-full h-auto"
                            loading={imageLoadPriority.stats ? 'eager' : 'lazy'}
                          />
                        </div>
                        <CopyButtons
                          onCopyMarkdown={() => copyToClipboard(getMarkdown(), 'Markdown')}
                          onCopyURL={() => copyToClipboard(getCurrentUrl(), 'URL')}
                          onCopyHTML={() => copyToClipboard(getHTML(), 'HTML')}
                          copiedType={copiedType}
                        />
                      </>
                    ) : (
                      <div className="rounded-lg border-2 border-dashed border-border bg-muted/20 flex items-center justify-center min-h-[200px]">
                        <p className="text-muted-foreground">Enter a username to preview</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="languages" className="space-y-4">
                    {username ? (
                      <>
                        <div className="rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center min-h-[200px]">
                          <img
                            src={buildLanguagesUrl() || "/placeholder.svg"}
                            alt="Top Languages"
                            className="w-full h-auto"
                            loading={imageLoadPriority.languages ? 'eager' : 'lazy'}
                          />
                        </div>
                        <CopyButtons
                          onCopyMarkdown={() => copyToClipboard(getMarkdown(), 'Markdown')}
                          onCopyURL={() => copyToClipboard(getCurrentUrl(), 'URL')}
                          onCopyHTML={() => copyToClipboard(getHTML(), 'HTML')}
                          copiedType={copiedType}
                        />
                      </>
                    ) : (
                      <div className="rounded-lg border-2 border-dashed border-border bg-muted/20 flex items-center justify-center min-h-[200px]">
                        <p className="text-muted-foreground">Enter a username to preview</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="streak" className="space-y-4">
                    {username ? (
                      <>
                        <div className="rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center min-h-[200px]">
                          <img
                            src={buildStreakUrl() || "/placeholder.svg"}
                            alt="GitHub Streak"
                            className="w-full h-auto"
                            loading={imageLoadPriority.streak ? 'eager' : 'lazy'}
                          />
                        </div>
                        <CopyButtons
                          onCopyMarkdown={() => copyToClipboard(getMarkdown(), 'Markdown')}
                          onCopyURL={() => copyToClipboard(getCurrentUrl(), 'URL')}
                          onCopyHTML={() => copyToClipboard(getHTML(), 'HTML')}
                          copiedType={copiedType}
                        />
                      </>
                    ) : (
                      <div className="rounded-lg border-2 border-dashed border-border bg-muted/20 flex items-center justify-center min-h-[200px]">
                        <p className="text-muted-foreground">Enter a username to preview</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-16 py-6 border-t border-border/50">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-4">Produced by CumaKaradash for NoneFiles</p>
            
            {/* Social Links */}
            <div className="flex items-center justify-center gap-6 mb-4">
              <a 
                href="https://cumakaradash.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Chrome className="w-4 h-4" />
                <span>Portfolio</span>
              </a>
              <a 
                href="https://linkedin.com/in/CumaKaradash" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
              <a 
                href="https://github.com/CumaKaradash" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a 
                href="https://medium.com/@CumaKaradash" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>Medium</span>
              </a>
            </div>
            
            <div className="flex items-center justify-center gap-1">
              <span>Made with</span>
              <Github className="w-4 h-4" />
              <span>for developers</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

function CopyButtons({
  onCopyMarkdown,
  onCopyURL,
  onCopyHTML,
  copiedType,
}: {
  onCopyMarkdown: () => void
  onCopyURL: () => void
  onCopyHTML: () => void
  copiedType: string | null
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={onCopyMarkdown} variant="outline" size="sm" className="flex-1">
        {copiedType === 'Markdown' ? (
          <Check className="w-4 h-4 mr-2" />
        ) : (
          <Copy className="w-4 h-4 mr-2" />
        )}
        Copy Markdown
      </Button>
      <Button onClick={onCopyURL} variant="outline" size="sm" className="flex-1">
        {copiedType === 'URL' ? (
          <Check className="w-4 h-4 mr-2" />
        ) : (
          <Copy className="w-4 h-4 mr-2" />
        )}
        Copy URL
      </Button>
      <Button onClick={onCopyHTML} variant="outline" size="sm" className="flex-1">
        {copiedType === 'HTML' ? (
          <Check className="w-4 h-4 mr-2" />
        ) : (
          <Copy className="w-4 h-4 mr-2" />
        )}
        Copy HTML
      </Button>
    </div>
  )
}
