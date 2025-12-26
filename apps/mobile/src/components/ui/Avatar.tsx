import * as AvatarPrimitive from "@rn-primitives/avatar";
import { cn } from "@/lib/utils";

function Avatar(
	props: AvatarPrimitive.RootProps &
		React.RefAttributes<AvatarPrimitive.RootRef>,
) {
	const { className, ...restProps } = props;

	return (
		<AvatarPrimitive.Root
			className={cn(
				"relative flex size-8 shrink-0 overflow-hidden rounded-full",
				className,
			)}
			{...restProps}
		/>
	);
}

function AvatarFallback(
	props: AvatarPrimitive.FallbackProps &
		React.RefAttributes<AvatarPrimitive.FallbackRef>,
) {
	const { className, ...restProps } = props;

	return (
		<AvatarPrimitive.Fallback
			className={cn(
				"bg-muted flex size-full flex-row items-center justify-center rounded-full",
				className,
			)}
			{...restProps}
		/>
	);
}

export { Avatar, AvatarFallback };
