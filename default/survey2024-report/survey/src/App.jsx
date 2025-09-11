import {
	ArcElement,
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
} from "chart.js";
import { useEffect, useMemo, useState } from "react";
import QuestionCard from "./components/QuestionCard";
import SectionNavigation from "./components/SectionNavigation";
import FreeResponseSection from "./components/FreeResponseSection";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
	PointElement,
	LineElement,
);

function App() {
	const [surveyData, setSurveyData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [selectedSection, setSelectedSection] = useState("all");
	const [error, setError] = useState(null);

	useEffect(() => {
		fetch("./survey_results.json")
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then((data) => {
				setSurveyData(data);
				setLoading(false);
			})
			.catch((error) => {
				console.error("データ読み込みエラー:", error);
				setError(error.message);
				setLoading(false);
			});
	}, []);

	const sections = useMemo(() => {
		if (!surveyData) return [];
		const questionSections = [
			...new Set(Object.values(surveyData.questions).map((q) => q.section)),
		].filter(Boolean);

		if (surveyData.free_responses) {
			questionSections.push("自由回答");
		}

		return questionSections;
	}, [surveyData]);

	const filteredQuestions = useMemo(() => {
		if (!surveyData) return [];
		return Object.entries(surveyData.questions).filter(([, qdata]) => {
			if (selectedSection === "all") return true;
			return qdata.section === selectedSection;
		});
	}, [surveyData, selectedSection]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-lg text-gray-600">データを読み込んでいます...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-lg text-red-600">エラー: {error}</div>
			</div>
		);
	}

	return (
		<div className="bg-gray-50">
			<SectionNavigation
				sections={sections}
				selectedSection={selectedSection}
				onSectionChange={setSelectedSection}
			/>

			<main key={selectedSection} className="container mx-auto px-4 py-8">
				{selectedSection !== "自由回答" && (
					<div className="space-y-6">
						{filteredQuestions.map(([qid, qdata]) => (
							<QuestionCard key={qid} qid={qid} qdata={qdata} />
						))}
					</div>
				)}

				{selectedSection === "自由回答" && surveyData?.free_responses && (
					<FreeResponseSection freeResponses={surveyData.free_responses} />
				)}

				{selectedSection === "all" && surveyData?.free_responses && (
					<FreeResponseSection freeResponses={surveyData.free_responses} />
				)}
			</main>
		</div>
	);
}

export default App;
