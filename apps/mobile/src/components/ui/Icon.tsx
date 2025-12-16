import type { LucideIcon, LucideProps } from "lucide-react-native";
import { cssInterop } from "nativewind";
import { cn } from "@/lib/utils";

interface IconProps extends LucideProps {
	as: LucideIcon;
}

function IconImpl(props: IconProps) {
	const { as: IconComponent, ...restProps } = props;

	return <IconComponent {...restProps} />;
}

cssInterop(IconImpl, {
	className: {
		target: "style",
		nativeStyleToProp: {
			height: "size",
			width: "size",
		},
	},
});

function Icon(props: IconProps) {
	const { as: IconComponent, className, size = 14, ...restProps } = props;

	return (
		<IconImpl
			as={IconComponent}
			className={cn("text-foreground", className)}
			size={size}
			{...restProps}
		/>
	);
}

export { Icon };
