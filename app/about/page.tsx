import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Linkedin, Brain, Shield, Mail } from 'lucide-react'

export default function AboutPage() {
  const team = [
    {
      name: "Hemanth Peddada",
      role: "Project Lead",
      linkedin: "https://linkedin.com/in/hemanth-peddada-15j6grph",
    },
    {
      name: "Premkumar Kuppili",
      role: "Developer",
      linkedin: "https://linkedin.com/in/premkumarkuppili1845",
    },
    {
      name: "Sravya Kandala",
      role: "Developer",
      linkedin: "https://linkedin.com/in/sravya-kandala-40086b295",
    },
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-5xl">
        <Link href="/">
          <Button variant="outline" className="mb-8 border-primary/30 text-primary hover:bg-primary/10 bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Shield className="h-10 w-10 text-primary" />
            <h1 className="font-serif text-5xl font-bold italic text-primary">KortexFlow</h1>
          </div>
          <p className="font-mono text-2xl text-primary">The Protocol of Ownership</p>
        </div>

        <section className="mb-16">
          <div className="rounded-lg border border-primary/20 bg-card/50 p-8 backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="font-mono text-2xl font-bold text-primary">
                I. Mission Statement: The Protocol of Ownership
              </h2>
            </div>

            <div className="space-y-4 font-serif text-lg leading-relaxed text-foreground">
              <p>
                KortexFlow was born from a simple realization: the modern inbox is a chaotic, overwhelming to-do list
                that steals our focus and compromises our privacy. We are constantly searching for tasks, deadlines, and
                meetings buried in digital clutter, and in doing so, we surrender control of our most valuable asset—our
                time and our data.
              </p>

              <p>
                KortexFlow is the answer. It is an AI-powered personal assistant that transforms your digital chaos into
                a clear, actionable plan. Our mission is to provide a single, intelligent dashboard that not only
                manages your life but also guarantees your absolute ownership over the data that defines it.
              </p>

              <p>
                We achieve this by building KortexFlow on the{" "}
                <span className="font-semibold text-primary">Algorand blockchain</span> using smart contracts. This
                architecture ensures that every task, every event, and every piece of extracted information is secured
                on a decentralized ledger, not on a private server. KortexFlow is not just a productivity tool; it is a{" "}
                <span className="font-semibold italic">declaration of digital sovereignty</span>, putting the
                operator—you—back in complete control.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <Brain className="h-8 w-8 text-primary" />
              <h2 className="font-mono text-3xl font-bold text-primary">
                II. Block Genesis: Meet the Development Team
              </h2>
            </div>
            <p className="font-serif text-lg italic text-muted-foreground">
              A group of developers dedicated to merging cutting-edge AI with the principles of Web3 decentralization.
            </p>
          </div>

          <div className="mb-8 rounded-lg border border-primary/20 bg-card/50 p-6 backdrop-blur-sm">
            <p className="font-serif text-base leading-relaxed text-foreground">
              KortexFlow is the flagship project of the Block Genesis Team. We believe the future of personal technology
              must be intelligent, secure, and user-owned. We invite you to connect with us and follow the development
              journey as we continue to build the next generation of personal organization tools.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {team.map((member) => (
              <div
                key={member.name}
                className="group rounded-lg border border-primary/30 bg-card p-6 shadow-lg transition-all duration-300 hover:border-primary hover:shadow-[0_0_25px_rgba(34,197,94,0.3)]"
              >
                <div className="mb-4">
                  <p className="mb-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">Role</p>
                  <p className="font-serif text-sm font-semibold text-primary">{member.role}</p>
                </div>

                <div className="mb-4">
                  <p className="mb-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">Name</p>
                  <h3 className="font-mono text-lg font-bold text-foreground">{member.name}</h3>
                </div>

                <div>
                  <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    LinkedIn Profile
                  </p>
                  <a
                    href={`https://${member.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-sm font-mono text-primary transition-all hover:border-primary hover:bg-primary/10 hover:shadow-[0_0_10px_rgba(34,197,94,0.2)]"
                  >
                    <Linkedin className="h-4 w-4" />
                    Connect
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="rounded-lg border border-primary/20 bg-card/50 p-8 text-center backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-center gap-3">
              <Mail className="h-6 w-6 text-primary" />
              <h2 className="font-mono text-2xl font-bold text-primary">Support & Queries</h2>
            </div>
            <p className="mb-4 font-serif text-lg text-foreground">
              Have questions or need assistance? Reach out to our team.
            </p>
            <a
              href="mailto:kortexflowsync@gmail.com"
              className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-6 py-3 font-mono text-primary transition-all hover:border-primary hover:bg-primary/10 hover:shadow-[0_0_15px_rgba(34,197,94,0.2)]"
            >
              <Mail className="h-5 w-5" />
              kortexflowsync@gmail.com
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
