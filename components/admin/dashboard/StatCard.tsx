import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/ui/loader";
import Link from "next/link";

export const StatCard = ({
  title,
  value,
  icon: Icon,
  link,
  linkText,
  isLoading
}: {
  title: string;
  value: number | string;
  icon: any;
  link?: string;
  linkText?: string;
  isLoading: boolean;
}) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-gist text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-gist">
        {isLoading ? <Loader /> : value}
      </div>
    </CardContent>
    {link && linkText && (
      <CardFooter>
        <Button className="px-2 text-sm font-gist text-black hover:no-underline">
          <Link href={link}>{linkText}</Link>
        </Button>
      </CardFooter>
    )}
  </Card>
);