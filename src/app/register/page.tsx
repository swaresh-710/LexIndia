import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FileText } from "lucide-react";
import { register } from "@/lib/actions/auth";

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-md shadow-lg border-muted/20">
                <CardHeader className="space-y-1 items-center justify-center pb-6">
                    <div className="flex items-center gap-2 font-bold text-2xl tracking-tight mb-2 text-primary">
                        <FileText className="h-8 w-8" />
                        <span>LexIndia</span>
                    </div>
                    <CardTitle className="text-2xl text-center">Create an account</CardTitle>
                    <CardDescription className="text-center">
                        Enter your details below to create your advocate account
                    </CardDescription>
                </CardHeader>
                <form action={register}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" placeholder="Adv. Rajesh Kumar" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full" type="submit">Create account</Button>
                        <div className="text-sm text-center text-muted-foreground w-full">
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary hover:underline font-medium">
                                Sign in
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
