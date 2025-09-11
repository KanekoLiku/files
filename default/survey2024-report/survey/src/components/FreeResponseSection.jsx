import React, { useState } from "react";
import FreeResponseCard from "./FreeResponseCard";

const FreeResponseSection = ({ freeResponses }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [expandedItems, setExpandedItems] = useState(new Set());

	if (!freeResponses) {
		return null;
	}

	const categories = Object.keys(freeResponses);

	const getFilteredResponses = () => {
		const results = [];

		categories.forEach((categoryKey) => {
			if (selectedCategory === "all" || selectedCategory === categoryKey) {
				const category = freeResponses[categoryKey];
				category.responses.forEach((response) => {
					if (
						!searchTerm ||
						response.question
							.toLowerCase()
							.includes(searchTerm.toLowerCase()) ||
						response.answer.toLowerCase().includes(searchTerm.toLowerCase())
					) {
						results.push({
							...response,
							categoryKey,
							categoryTitle: category.title,
						});
					}
				});
			}
		});

		return results;
	};

	const filteredResponses = getFilteredResponses();

	const toggleAllExpanded = () => {
		if (expandedItems.size > 0) {
			setExpandedItems(new Set());
		} else {
			setExpandedItems(new Set(filteredResponses.map((_, index) => index)));
		}
	};

	return (
		<div className="mt-8">
			<div className="bg-white rounded-lg shadow-lg p-6">
				<h2 className="text-2xl font-bold mb-6 text-gray-800">
					自由回答・ご意見・ご要望
				</h2>

				<div className="mb-6 space-y-4">
					<div className="flex flex-col sm:flex-row gap-4">
						<select
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
							className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="all">すべてのカテゴリ</option>
							{categories.map((key) => (
								<option key={key} value={key}>
									{freeResponses[key].title} ({freeResponses[key].count}件)
								</option>
							))}
						</select>

						<input
							type="text"
							placeholder="質問や回答を検索..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>

						<button
							type="button"
							onClick={toggleAllExpanded}
							className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
						>
							{expandedItems.size > 0 ? "全て折りたたむ" : "全て展開"}
						</button>
					</div>

					<div className="text-sm text-gray-600">
						{filteredResponses.length}件の回答を表示中
						{searchTerm && ` (検索: "${searchTerm}")`}
					</div>
				</div>

				{selectedCategory !== "all" && freeResponses[selectedCategory] && (
					<div className="mb-6 p-4 bg-blue-50 rounded-lg">
						<h3 className="font-semibold text-blue-900 mb-2">
							{freeResponses[selectedCategory].title}
						</h3>
						<p className="text-sm text-blue-700">
							{freeResponses[selectedCategory].description}
						</p>
					</div>
				)}

				<div className="space-y-4">
					{filteredResponses.length > 0 ? (
						filteredResponses.map((response, index) => (
							<FreeResponseCard
								key={`${response.categoryKey}-${response.number}-${index}`}
								response={response}
								categoryTitle={response.categoryTitle}
								isExpanded={expandedItems.has(index)}
								onToggle={() => {
									const newExpanded = new Set(expandedItems);
									if (newExpanded.has(index)) {
										newExpanded.delete(index);
									} else {
										newExpanded.add(index);
									}
									setExpandedItems(newExpanded);
								}}
							/>
						))
					) : (
						<div className="text-center py-8 text-gray-500">
							検索条件に一致する回答が見つかりませんでした
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default FreeResponseSection;
