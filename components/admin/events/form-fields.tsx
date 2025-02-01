import { FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export const FormFieldComponent = {
    textarea: (props: any) => (
        <Textarea className="min-h-[100px] resize-none" {...props} />
    ),
    select: ({ onChange, value, options, label }: any) => (
        <Select onValueChange={onChange} defaultValue={value}>
            <FormControl>
                <SelectTrigger>
                    <SelectValue
                        placeholder={`Select ${label.toLowerCase()}`}
                    />
                </SelectTrigger>
            </FormControl>
            <SelectContent>
                {options?.map((option: any) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    ),
    default: (props: any) => <Input {...props} />,
};
