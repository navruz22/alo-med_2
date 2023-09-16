import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { BsFillPrinterFill } from "react-icons/bs"
import { useReactToPrint } from "react-to-print"
import Print from "../../../doctor/components/Print"
import LabPrint from "../../../laborotory/components/Print"
import QRCode from "qrcode"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


const DepartsModal = ({ departs, setModal, modal, showSmallCehckReturn }) => {
    const { t } = useTranslation()

    return (
        <div
            className={`modal fade show ${modal ? "" : "d-none"}`}
            id="customModal"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="customModalLabel"
            style={{ display: "block" }}
            aria-modal="true"
        >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-body">
                        <div>
                            {departs.length > 0 && departs.map((item, ind) =>
                                <div style={{cursor: 'pointer'}} onClick={() => showSmallCehckReturn(item)} key={ind} className="p-2 bg-alotrade mb-2">
                                    <span className="text-white text-[16px] font-bold">{item?.departmentname}: {item?.room}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="modal-footer custom">
                        <div className="left-side">
                            <button
                                className="btn btn-link danger w-100"
                                data-dismiss="modal"
                                onClick={() => setModal(false)}
                            >
                                {t("Bekor qilish")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default DepartsModal