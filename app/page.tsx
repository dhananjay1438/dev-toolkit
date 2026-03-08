import Link from "next/link"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  FileJson,
  Code2,
  Table,
  FileText,
  Type,
  Link as LinkIcon,
  Key,
  Shield,
  Clock,
  CalendarDays,
  Regex,
  Palette,
  Hash,
  Terminal,
} from "lucide-react"

const toolCategories = [
  {
    title: "Data Morphers & Formatters",
    description: "Format, convert, and morph your data structures.",
    tools: [
      { title: "JSON Formatter", href: "/data/json-formatter", icon: FileJson, desc: "Format, validate, and beautify JSON data." },
      { title: "YAML ↔ JSON", href: "/data/yaml-json", icon: Code2, desc: "Convert between YAML and JSON seamlessly." },
      { title: "CSV Converter", href: "/data/csv-converter", icon: Table, desc: "Transform CSV to JSON or Markdown tables." },
      { title: "HTML to Markdown", href: "/data/html-markdown", icon: FileText, desc: "Strip HTML tags and convert to clean Markdown." },
      { title: "Case Converter", href: "/data/case-converter", icon: Type, desc: "Convert text between various naming conventions." },
    ],
  },
  {
    title: "Encoders & Decoders",
    description: "Encode and decode strings and tokens.",
    tools: [
      { title: "URL Encoder/Decoder", href: "/encoders/url", icon: LinkIcon, desc: "Encode or decode URL components securely." },
      { title: "Base64 Encoder/Decoder", href: "/encoders/base64", icon: Key, desc: "Quickly encode or decode Base64 strings." },
      { title: "JWT Debugger", href: "/encoders/jwt", icon: Shield, desc: "Decode and inspect JSON Web Tokens locally." },
    ],
  },
  {
    title: "Time & Scheduling",
    description: "Manage timestamps and cron schedules.",
    tools: [
      { title: "Unix Timestamp to Date", href: "/time/unix-date", icon: Clock, desc: "Convert epoch timestamps to human-readable dates." },
      { title: "Cron Job Parser", href: "/time/cron-parser", icon: CalendarDays, desc: "Translate cron syntax into plain English." },
    ],
  },
  {
    title: "Web & Logic Polishers",
    description: "Test logic, generate hashes, and verify compliance.",
    tools: [
      { title: "RegEx Tester", href: "/web/regex-tester", icon: Regex, desc: "Test regular expressions with real-time highlighting." },
      { title: "Color & Contrast", href: "/web/color-picker", icon: Palette, desc: "Check color contrast ratios for WCAG compliance." },
      { title: "Hash Generator", href: "/web/hash-generator", icon: Hash, desc: "Generate MD5 and SHA-256 hashes instantly." },
      { title: "Curl Converter", href: "/web/curl-converter", icon: Terminal, desc: "Convert raw curl commands into code snippets." },
    ],
  },
]

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Dev Toolkit</h1>
        <p className="text-muted-foreground">
          A lightning-fast, fully client-side suite of developer tools. No backend, zero latency.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {toolCategories.map((category) => (
          <div key={category.title} className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight">{category.title}</h2>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {category.tools.map((tool) => (
                <Link key={tool.href} href={tool.href} className="block group">
                  <Card className="h-full transition-colors hover:border-primary/50 hover:bg-muted/50">
                    <CardHeader className="p-4">
                      <div className="flex items-center gap-2">
                        <tool.icon className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base">{tool.title}</CardTitle>
                      </div>
                      <CardDescription className="text-xs mt-2 line-clamp-2">
                        {tool.desc}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
