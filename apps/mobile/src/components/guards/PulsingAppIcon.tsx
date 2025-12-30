import { useEffect, useRef } from "react";
import { Animated, Image } from "react-native";
import appIcon from "@/assets/icon.png";

const usePulseAnimation = (enabled?: boolean) => {
	const pulseAnim = useRef(new Animated.Value(1)).current;

	useEffect(
		function pulseAnimation() {
			if (!enabled) return;

			const pulse = Animated.loop(
				Animated.sequence([
					Animated.timing(pulseAnim, {
						toValue: 1.1,
						duration: 1000,
						useNativeDriver: true,
					}),
					Animated.timing(pulseAnim, {
						toValue: 1,
						duration: 1000,
						useNativeDriver: true,
					}),
				]),
			);

			pulse.start();

			return () => {
				pulse.stop();
			};
		},
		[enabled, pulseAnim],
	);

	return pulseAnim;
};

interface PulsingAppIconProps {
	pulsing?: boolean;
	className?: string;
}

export function PulsingAppIcon(props: PulsingAppIconProps) {
	const { pulsing = true, className = "h-24 w-24" } = props;

	const pulseAnim = usePulseAnimation(pulsing);

	if (!pulsing) {
		return (
			<Image source={appIcon} className={className} resizeMode="contain" />
		);
	}

	return (
		<Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
			<Image source={appIcon} className={className} resizeMode="contain" />
		</Animated.View>
	);
}
