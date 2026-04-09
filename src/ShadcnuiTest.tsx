import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const ShadcnuiTest = () => {
  const [count, setCount] = useState(0);

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
      <Card style={{ width: "360px" }}>
        <CardHeader>
          <CardTitle>ShadcnUI Test Card</CardTitle>
          <CardDescription>
            A simple card to test ShadcnUI components in this project.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p style={{ marginBottom: "1rem" }}>
            Button click count: <strong>{count}</strong>
          </p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <Button onClick={() => setCount(c => c + 1)}>Primary</Button>
            <Button variant="secondary" onClick={() => setCount(c => c + 1)}>
              Secondary
            </Button>
            <Button variant="ghost" onClick={() => setCount(c => c + 1)}>
              Outline
            </Button>
            <Button variant="destructive" onClick={() => setCount(0)}>
              Reset
            </Button>
          </div>
        </CardContent>

        <CardFooter>
          <span style={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}>
            Shadcn cards + buttons are working ✓
          </span>
        </CardFooter>
      </Card>
    </div>
  );
};