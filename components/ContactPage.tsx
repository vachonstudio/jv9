import { motion } from "framer-motion";
import { Mail, MessageCircle, Calendar, Clock, Award, Users, Zap } from "lucide-react";
import { ContactForm } from "./ContactForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    description: "Best for detailed project inquiries",
    value: "vachon@gmail.com",
    action: "mailto:vachon@gmail.com"
  },
  {
    icon: Calendar,
    title: "Schedule a Call",
    description: "30-minute discovery call",
    value: "Book Meeting",
    action: "#" // Would link to Calendly or similar
  },
  {
    icon: MessageCircle,
    title: "Quick Response",
    description: "Typical response time",
    value: "Within 24 hours",
    action: null
  }
];

const workingStyle = [
  {
    icon: Users,
    title: "Collaborative Approach",
    description: "I work closely with your team to ensure alignment and knowledge transfer"
  },
  {
    icon: Zap,
    title: "Agile & Iterative",
    description: "Rapid prototyping and continuous feedback loops for faster results"
  },
  {
    icon: Award,
    title: "Measurable Impact",
    description: "Focus on metrics and KPIs that matter to your business goals"
  }
];

const availability = {
  status: "Available for new projects",
  nextAvailable: "January 2025",
  contractTypes: ["Full-time Contract", "Part-time Consulting", "Project-based Work", "Retainer Agreements"]
};

export function ContactPage() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="mb-4">Let's Work Together</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ready to transform your product experience? I'd love to learn about your project 
              and explore how we can create something amazing together.
            </p>
          </motion.div>

          {/* Availability Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-4 py-2 rounded-full mb-8"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">{availability.status}</span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Methods */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="mb-6">Get In Touch</h2>
              
              <div className="space-y-4 mb-8">
                {contactMethods.map((method, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <method.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="mb-1">{method.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {method.description}
                          </p>
                          {method.action ? (
                            <Button variant="outline" size="sm" asChild>
                              <a href={method.action}>{method.value}</a>
                            </Button>
                          ) : (
                            <span className="text-sm font-medium">{method.value}</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Working Style */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>How I Work</CardTitle>
                  <CardDescription>My approach to collaboration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {workingStyle.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="p-1 bg-muted rounded">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-1">{item.title}</h5>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Availability */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <CardTitle>Availability</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Next Available</p>
                      <p className="font-medium">{availability.nextAvailable}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Contract Types</p>
                      <div className="flex flex-wrap gap-1">
                        {availability.contractTypes.map((type, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div>
                  <h5 className="font-medium mb-2">What's your typical project timeline?</h5>
                  <p className="text-sm text-muted-foreground">
                    Most projects range from 2-6 months depending on scope. I provide detailed 
                    timelines during our initial consultation.
                  </p>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Do you work with startups?</h5>
                  <p className="text-sm text-muted-foreground">
                    Absolutely! I love helping startups build strong UX foundations from day one.
                    I offer flexible arrangements for early-stage companies.
                  </p>
                </div>
                <div>
                  <h5 className="font-medium mb-2">What deliverables do you provide?</h5>
                  <p className="text-sm text-muted-foreground">
                    Depending on the project: research reports, wireframes, prototypes, 
                    design systems, user flows, and comprehensive handoff documentation.
                  </p>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Can you work with our existing team?</h5>
                  <p className="text-sm text-muted-foreground">
                    Yes! I integrate seamlessly with existing teams and can mentor 
                    junior designers while delivering high-quality work.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}