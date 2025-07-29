import { useSession as useNextAuthSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useSession() {
	const { data: session, status, update } = useNextAuthSession();
	const router = useRouter();

	const isLoading = status === "loading";
	const isAuthenticated = status === "authenticated";
	const isUnauthenticated = status === "unauthenticated";

	// Redirect to sign in if not authenticated
	useEffect(() => {
		if (isUnauthenticated) {
			router.push("/auth/signin");
		}
	}, [isUnauthenticated, router]);

	return {
		session,
		status,
		isLoading,
		isAuthenticated,
		isUnauthenticated,
		update,
		user: session?.user,
	};
}

export function useProtectedSession() {
	const { session, status, isLoading, isAuthenticated, user } = useSession();

	if (isLoading) {
		return {
			session: null,
			status,
			isLoading: true,
			isAuthenticated: false,
			user: null,
		};
	}

	if (!isAuthenticated) {
		return {
			session: null,
			status,
			isLoading: false,
			isAuthenticated: false,
			user: null,
		};
	}

	return {
		session,
		status,
		isLoading: false,
		isAuthenticated: true,
		user,
	};
}
