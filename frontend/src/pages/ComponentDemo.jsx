import React from 'react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

export default function ComponentDemo() {
    return (
        <div className="p-8 space-y-12">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">UI Components Library</h1>
                <p className="text-muted-foreground mt-2">
                    Showcasing the new shadcn/ui foundation for COMPLAI.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Buttons & Inputs */}
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>Forms & Actions</CardTitle>
                        <CardDescription>Standard input elements and button variants.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="demo-input">Sample Input</Label>
                            <Input id="demo-input" placeholder="Type something..." />
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button>Primary</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="destructive">Destructive</Button>
                            <Button variant="ghost">Ghost</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Dialog & Select */}
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>Overlays & Selection</CardTitle>
                        <CardDescription>Accessible modals and dropdowns via Radix UI.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Framework Selection</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a framework" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="iso27001">ISO 27001</SelectItem>
                                    <SelectItem value="iso42001">ISO 42001</SelectItem>
                                    <SelectItem value="gdpr">GDPR</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-full">Open Dialog Demo</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Audit Verification</DialogTitle>
                                    <DialogDescription>
                                        This is a shadcn/ui Dialog component. It is fully accessible and
                                        uses Radix UI primitives.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                    <p className="text-sm text-muted-foreground">
                                        Dialogs are perfect for multi-step audit processes or evidence uploads.
                                    </p>
                                </div>
                                <div className="flex justify-end">
                                    <Button onClick={() => alert('Confirmed!')}>Confirm Action</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs Section */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Organisation Tabs</h2>
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="departments">Departments</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                        <Card>
                            <CardHeader>
                                <CardTitle>Executive Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Quick look at the organization's compliance heart-beat.
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="departments">
                        <div className="p-4 text-center border-2 border-dashed rounded-lg">
                            Department mapping workspace component placeholder.
                        </div>
                    </TabsContent>
                    <TabsContent value="analytics">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="h-[200px] flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-lg">
                                    [Chart Component Placeholder]
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </section>
        </div>
    )
}
