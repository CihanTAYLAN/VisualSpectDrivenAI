import { useState, useEffect, useCallback, useRef } from "react";

interface UseSpeechRecognitionProps {
	onResult: (transcript: string) => void;
}

// Type definitions for Web Speech API
declare global {
	interface Window {
		webkitSpeechRecognition: any;
		SpeechRecognition: any;
	}
}

export function useSpeechRecognition({ onResult }: UseSpeechRecognitionProps) {
	const [isListening, setIsListening] = useState(false);
	const [transcript, setTranscript] = useState("");
	const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
	const onResultRef = useRef(onResult);

	// Update ref when onResult changes
	useEffect(() => {
		onResultRef.current = onResult;
	}, [onResult]);

	useEffect(() => {
		if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
			const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
			const recognitionInstance = new (SpeechRecognition as any)();

			recognitionInstance.continuous = true;
			recognitionInstance.interimResults = true;
			recognitionInstance.lang = "en-US";

			recognitionInstance.onresult = (event: any) => {
				let finalTranscript = "";
				let interimTranscript = "";

				for (let i = event.resultIndex; i < event.results.length; i++) {
					const transcript = event.results[i][0].transcript;
					if (event.results[i].isFinal) {
						finalTranscript += transcript;
					} else {
						interimTranscript += transcript;
					}
				}

				setTranscript(finalTranscript || interimTranscript);

				if (finalTranscript) {
					onResultRef.current(finalTranscript);
				}
			};

			recognitionInstance.onerror = (event: any) => {
				console.error("Speech recognition error:", event.error);
				setIsListening(false);
			};

			recognitionInstance.onend = () => {
				setIsListening(false);
			};

			setRecognition(recognitionInstance);
		}
	}, []); // Empty dependency array to prevent infinite loop

	const startListening = useCallback(() => {
		if (recognition) {
			recognition.start();
			setIsListening(true);
			setTranscript("");
		}
	}, [recognition]);

	const stopListening = useCallback(() => {
		if (recognition) {
			recognition.stop();
			setIsListening(false);
		}
	}, [recognition]);

	return {
		isListening,
		transcript,
		startListening,
		stopListening,
		isSupported: !!recognition,
	};
}
