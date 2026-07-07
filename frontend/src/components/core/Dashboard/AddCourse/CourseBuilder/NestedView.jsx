import { useState } from "react"
import { AiFillCaretDown } from "react-icons/ai"
import { FaPlus } from "react-icons/fa"
import { MdEdit } from "react-icons/md"
import { RiDeleteBin6Line } from "react-icons/ri"
import { RxDropdownMenu } from "react-icons/rx"
import { toast } from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { setCourse } from "../../../../../slices/courseSlice"
import { deleteSection, deleteSubSection } from "../../../../../services/operations/courseDetailsAPI"
import SubSectionModal from "./SubSectionModel"
import ConfirmationModal from "../../../../common/ConfirmationModal"


export default function NestedView({ handleChangeEditSectionName }) {
    const { course } = useSelector((state) => state.course)
    const { token } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    // State to manage the modals (we will build these modals next!)
    const [addSubSection, setAddSubsection] = useState(null)
    const [viewSubSection, setViewSubSection] = useState(null)
    const [editSubSection, setEditSubSection] = useState(null)

    // State for the delete confirmation modal
    const [confirmationModal, setConfirmationModal] = useState(null)

    const handleDeleteSection = async (sectionId) => {
        const result = await deleteSection(sectionId, course._id, token)
        if (result) {
            dispatch(setCourse(result))
            toast.success("Section deleted successfully")
        }
        setConfirmationModal(null)
    }

    const handleDeleteSubSection = async (subSectionId, sectionId) => {
        const result = await deleteSubSection(subSectionId, sectionId, token)
        if (result) {
            const updatedCourseContent = course.courseContent.map((section) =>
                section._id === sectionId ? result : section
            )
            dispatch(setCourse({ ...course, courseContent: updatedCourseContent }))
            toast.success("Lecture deleted successfully")
        }
        setConfirmationModal(null)
    }

    return (
        <>
            <div className="rounded-lg bg-richblack-700 p-6 px-8" id="nestedViewContainer">
                {course?.courseContent?.map((section) => (

                    /* SECTION CONTAINER */
                    <details key={section._id} open className="mb-4 text-richblack-5">
                        {/* Section Header */}
                        <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
                            <div className="flex items-center gap-x-3">
                                <RxDropdownMenu className="text-2xl text-richblack-50" />
                                <p className="font-semibold text-richblack-50">
                                    {section.sectionName}
                                </p>
                            </div>

                            <div className="flex items-center gap-x-3">
                                <button
                                    onClick={() => handleChangeEditSectionName(section._id, section.sectionName)}
                                >
                                    <MdEdit className="text-xl text-richblack-300 hover:text-richblack-50" />
                                </button>
                                <button
                                    onClick={() =>
                                        setConfirmationModal({
                                            text1: "Delete this Section?",
                                            text2: "All the lectures in this section will be deleted",
                                            btn1Text: "Delete",
                                            btn2Text: "Cancel",
                                            btn1Handler: () => handleDeleteSection(section._id),
                                            btn2Handler: () => setConfirmationModal(null),
                                        })
                                    }
                                >
                                    <RiDeleteBin6Line className="text-xl text-richblack-300 hover:text-pink-200" />
                                </button>
                                <span className="font-medium text-richblack-300">|</span>
                                <AiFillCaretDown className="text-xl text-richblack-300" />
                            </div>
                        </summary>

                        {/* LECTURES (SUBSECTIONS) CONTAINER */}
                        <div className="px-6 pb-4">
                            {section.subSection?.map((data) => (
                                <div
                                    key={data?._id}
                                    onClick={() => setViewSubSection(data)}
                                    className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2"
                                >
                                    <div className="flex items-center gap-x-3 py-2">
                                        <RxDropdownMenu className="text-2xl text-richblack-50" />
                                        <p className="font-semibold text-richblack-50">{data.title}</p>
                                    </div>

                                    <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-x-3">
                                        <button
                                            onClick={() => setEditSubSection({ ...data, sectionId: section._id })}
                                        >
                                            <MdEdit className="text-xl text-richblack-300 hover:text-richblack-50" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                setConfirmationModal({
                                                    text1: "Delete this Sub-Section?",
                                                    text2: "This lecture will be deleted",
                                                    btn1Text: "Delete",
                                                    btn2Text: "Cancel",
                                                    btn1Handler: () => handleDeleteSubSection(data._id, section._id),
                                                    btn2Handler: () => setConfirmationModal(null),
                                                })
                                            }
                                        >
                                            <RiDeleteBin6Line className="text-xl text-richblack-300 hover:text-pink-200" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Add Lecture Button */}
                            <button
                                onClick={() => setAddSubsection(section._id)}
                                className="mt-3 flex items-center gap-x-1 text-yellow-50 font-semibold"
                            >
                                <FaPlus className="text-lg" />
                                <p>Add Lecture</p>
                            </button>
                        </div>
                    </details>
                ))}
            </div>

            {/* Renders the Add SubSection Modal */}
            {addSubSection ? (
                <SubSectionModal
                    modalData={addSubSection} // passing section ID
                    setModalData={setAddSubsection}
                    add={true}
                />
            ) : viewSubSection ? (
                <SubSectionModal
                    modalData={viewSubSection} // passing lecture data
                    setModalData={setViewSubSection}
                    view={true}
                />
            ) : editSubSection ? (
                <SubSectionModal
                    modalData={editSubSection} // passing lecture data
                    setModalData={setEditSubSection}
                    edit={true}
                />
            ) : (
                <></>
            )}
            {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}

        </>
    )
}
