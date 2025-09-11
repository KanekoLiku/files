import { useState } from "react";

function SectionNavigation({ sections, selectedSection, onSectionChange }) {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<nav className="sticky top-0 z-10 bg-white shadow-sm border-b">
			<div className="container mx-auto px-4">
				<div className="sm:hidden">
					<div className="flex items-center justify-between py-3">
						<span className="text-sm font-medium text-gray-700">
							現在: {selectedSection === "all" ? "すべて表示" : selectedSection}
						</span>
						<button
							type="button"
							onClick={() => setIsExpanded(!isExpanded)}
							className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
							aria-label="メニューを開く"
						>
							<svg
								className={`w-5 h-5 transform transition-transform ${isExpanded ? "rotate-180" : ""}`}
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</button>
					</div>

					{isExpanded && (
						<div className="pb-3 max-h-60 overflow-y-auto">
							<div className="grid grid-cols-2 gap-2">
								<button
									type="button"
									onClick={() => {
										onSectionChange("all");
										setIsExpanded(false);
									}}
									className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
										selectedSection === "all"
											? "bg-purple-600 text-white"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200"
									}`}
								>
									すべて表示
								</button>
								{sections.map((section) => (
									<button
										type="button"
										key={section}
										onClick={() => {
											onSectionChange(section);
											setIsExpanded(false);
										}}
										className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
											selectedSection === section
												? "bg-purple-600 text-white"
												: "bg-gray-100 text-gray-700 hover:bg-gray-200"
										}`}
									>
										{section}
									</button>
								))}
							</div>
						</div>
					)}
				</div>

				<div className="hidden sm:block overflow-x-auto">
					<div className="flex gap-2 py-4 min-w-max">
						<button
							type="button"
							onClick={() => onSectionChange("all")}
							className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
								selectedSection === "all"
									? "bg-purple-600 text-white"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200"
							}`}
						>
							すべて表示
						</button>
						{sections.map((section) => (
							<button
								type="button"
								key={section}
								onClick={() => onSectionChange(section)}
								className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
									selectedSection === section
										? "bg-purple-600 text-white"
										: "bg-gray-100 text-gray-700 hover:bg-gray-200"
								}`}
							>
								{section}
							</button>
						))}
					</div>
				</div>
			</div>
		</nav>
	);
}

export default SectionNavigation;
