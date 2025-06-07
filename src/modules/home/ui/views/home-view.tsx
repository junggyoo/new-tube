import { CategoriesSection } from "../sections/categories-section";

interface HomeViewProps {
	categoryId?: string;
}

export function HomeView({ categoryId }: HomeViewProps) {
	return (
		<div className="flex flex-col gap-y-6 max-w-[2400px] mx-auto mb-10 px-4 pt-2">
			<CategoriesSection categoryId={categoryId} />
		</div>
	);
}
