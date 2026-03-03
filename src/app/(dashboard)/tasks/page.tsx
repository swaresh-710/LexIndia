import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getTasks, createTask, toggleTaskStatus } from "@/lib/actions/task";
import { getCases } from "@/lib/actions/case";
import { Calendar, CheckCircle, Circle, PlusCircle, AlertCircle } from "lucide-react";

export default async function TasksPage() {
    const tasks = await getTasks();
    const cases = await getCases();

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tasks & Reminders</h1>
                    <p className="text-muted-foreground">Manage your deadlines and pending work.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Task List */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Upcoming Tasks</CardTitle>
                        <CardDescription>Your tasks ordered by status and due date.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {tasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed">
                                <CheckCircle className="h-8 w-8 text-muted-foreground mb-4 opacity-50" />
                                <h3 className="text-lg font-semibold">All caught up!</h3>
                                <p className="text-muted-foreground text-sm">
                                    You have no pending tasks. Enjoy your day!
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y relative">
                                {tasks.map((task: any) => {
                                    const isDone = task.status === "DONE";
                                    return (
                                        <div key={task.id} className={`py-4 flex items-start gap-4 transition-all ${isDone ? 'opacity-50' : ''}`}>
                                            <form action={toggleTaskStatus.bind(null, task.id, task.status)}>
                                                <button type="submit" className="mt-1 transition-colors hover:text-primary focus:outline-none">
                                                    {isDone ? (
                                                        <CheckCircle className="h-5 w-5 text-primary" />
                                                    ) : (
                                                        <Circle className="h-5 w-5 text-muted-foreground" />
                                                    )}
                                                </button>
                                            </form>
                                            <div className="flex-1 space-y-1">
                                                <p className={`font-medium ${isDone ? 'line-through text-muted-foreground' : ''}`}>
                                                    {task.title}
                                                </p>
                                                {task.description && (
                                                    <p className="text-sm text-muted-foreground">{task.description}</p>
                                                )}
                                                <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground pt-1">
                                                    {task.dueDate && (
                                                        <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                                                            <Calendar className="h-3 w-3" />
                                                            {new Date(task.dueDate).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                    {task.case?.title && (
                                                        <span className="bg-muted px-2 py-0.5 rounded-sm">
                                                            Case: {task.case.title}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* New Task Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PlusCircle className="h-5 w-5 text-primary" />
                            New Task
                        </CardTitle>
                        <CardDescription>Instantly add a reminder.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={createTask} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Task Title <span className="text-red-500">*</span></Label>
                                <Input id="title" name="title" placeholder="Draft property deed..." required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                                <Input id="description" name="description" placeholder="Client requested priority handling..." />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dueDate">Due Date</Label>
                                <Input id="dueDate" name="dueDate" type="date" className="block" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="caseId">Link to Case <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                                <select
                                    id="caseId"
                                    name="caseId"
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">None (General Task)</option>
                                    {cases.map(c => (
                                        <option key={c.id} value={c.id}>{c.title}</option>
                                    ))}
                                </select>
                            </div>

                            <Button type="submit" className="w-full mt-2">Add Task</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
