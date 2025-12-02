import { EmailTemplate } from "@/prisma/generated/client";

interface EmailTemplateEditorProps {
    templates: any[];
    selectedTemplate: any | undefined;
    setSelectedTemplate: (template: any) => void;
    campaignType: string;
    editableContent: { subject: string; body: string };
    setEditableContent: React.Dispatch<React.SetStateAction<{ subject: string; body: string }>>;
}

export default function EmailTemplateEditor({
    templates,
    selectedTemplate,
    setSelectedTemplate,
    campaignType,
    editableContent,
    setEditableContent,
}: EmailTemplateEditorProps) {

    const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditableContent(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const placeholders = [
        '[[SPONSOR_NAME]]',
        '[[CAMPAIGN_NAME]]',
        ...(campaignType === 'STUDENT_SPONSORSHIP' ? ['[[STUDENT_NAME]]'] : []),
        ...(campaignType === 'CIRCLE_SPONSORSHIP' ? ['[[CIRCLE_NAME]]', '[[STUDENTS_LIST]]'] : []),
    ];

    return (
        <div className="border rounded-lg shadow-sm p-6 bg-white text-gray-800">
            {/* Header */}
            <h2 className="text-xl font-semibold mb-4">Email Template</h2>

            <div className="space-y-4">

                {/* Template Selector */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Select Template:</label>
                    <select
                        className="border rounded-md p-2 bg-white"
                        value={selectedTemplate?.id ?? ""}
                        onChange={(e) =>
                            setSelectedTemplate(
                                templates.find((t) => t.id === Number(e.target.value))!
                            )
                        }
                    >
                        <option value="" disabled>Select a template</option>
                        {templates.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Template View */}
                {selectedTemplate && (
                    <div className="space-y-3">

                        {/* Subject */}
                        <div>
                            <label className="text-sm font-medium">Subject:</label>
                            <input
                                type="text"
                                value={editableContent.subject}
                                onChange={handleContentChange}
                                className="w-full border rounded-md p-2 mt-1 bg-gray-100 text-gray-700"
                            />
                        </div>

                        {/* Body */}
                        <div>
                            <label className="text-sm font-medium">Body (Dynamic Parameters):</label>
                            <textarea
                                value={editableContent.body}
                                onChange={handleContentChange}
                                rows={10}
                                className="w-full border rounded-md p-2 mt-1 bg-gray-100 text-gray-700"
                            />
                        </div>

                        {/* Placeholder List */}
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Available Placeholders:</span> <br />
                            {placeholders.join(", ")}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
