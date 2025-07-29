import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const { command, mode, currentCanvas } = await request.json();

		if (!command) {
			return NextResponse.json({ error: "Command is required" }, { status: 400 });
		}

		console.log("Processing command:", command);

		// Generate mock elements based on command content
		const mockElements = generateMockElements(command.toLowerCase());

		// Return mock elements for testing
		return NextResponse.json({
			elements: mockElements,
			message: `Created elements based on: "${command}"`,
			success: true,
		});
	} catch (error) {
		console.error("Error processing AI command:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

function generateMockElements(command: string): any[] {
	const timestamp = Date.now();
	const elements: any[] = [];

	// Check for different shape types in the command
	if (command.includes("rectangle") || command.includes("dikdörtgen")) {
		elements.push({
			type: "geo",
			x: 100,
			y: 100,
			props: {
				geo: "rectangle",
				w: 200,
				h: 100,
				color:
					command.includes("red") || command.includes("kırmızı")
						? "red"
						: command.includes("blue") || command.includes("mavi")
						? "blue"
						: command.includes("green") || command.includes("yeşil")
						? "green"
						: "black",
				fill: "solid",
				dash: "draw",
				size: "m",
			},
		});
	}

	if (command.includes("circle") || command.includes("daire") || command.includes("çember")) {
		elements.push({
			type: "geo",
			x: 150,
			y: 150,
			props: {
				geo: "ellipse",
				w: 120,
				h: 120,
				color:
					command.includes("red") || command.includes("kırmızı")
						? "red"
						: command.includes("blue") || command.includes("mavi")
						? "blue"
						: command.includes("green") || command.includes("yeşil")
						? "green"
						: "black",
				fill: "solid",
				dash: "draw",
				size: "m",
			},
		});
	}

	if (command.includes("triangle") || command.includes("üçgen")) {
		elements.push({
			type: "geo",
			x: 200,
			y: 200,
			props: {
				geo: "triangle",
				w: 150,
				h: 150,
				color:
					command.includes("red") || command.includes("kırmızı")
						? "red"
						: command.includes("blue") || command.includes("mavi")
						? "blue"
						: command.includes("green") || command.includes("yeşil")
						? "green"
						: "black",
				fill: "solid",
				dash: "draw",
				size: "m",
			},
		});
	}

	if (command.includes("text") || command.includes("yazı") || command.includes("metin")) {
		elements.push({
			type: "text",
			x: 120,
			y: 130,
			props: {
				text: command.includes("hello") || command.includes("merhaba") ? "Hello World!" : command.includes("ai") ? "AI Generated Text" : command.includes("test") ? "Test Text" : "Sample Text",
				color: "black",
				font: "draw",
				align: "middle",
				size: "m",
			},
		});
	}

	if (command.includes("line") || command.includes("çizgi")) {
		elements.push({
			type: "line",
			x: 50,
			y: 50,
			props: {
				color:
					command.includes("red") || command.includes("kırmızı")
						? "red"
						: command.includes("blue") || command.includes("mavi")
						? "blue"
						: command.includes("green") || command.includes("yeşil")
						? "green"
						: "black",
				dash: "draw",
				size: "m",
				spline: "line",
			},
		});
	}

	// If no specific shapes mentioned, create a default rectangle
	if (elements.length === 0) {
		elements.push({
			type: "geo",
			x: 100,
			y: 100,
			props: {
				geo: "rectangle",
				w: 150,
				h: 80,
				color: "blue",
				fill: "solid",
				dash: "draw",
				size: "m",
			},
		});
	}

	return elements;
}
