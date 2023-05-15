import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import { DatePickers } from "../../doctor/doctorclients/clientComponents/DatePickers";
import { Pagination } from "../components/Pagination";
import ReactHtmlTableToExcel from 'react-html-table-to-excel';
import { faAngleDown, faAngleUp, faPrint } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from "react-select"
import { useTranslation } from "react-i18next";

const DirectServices = () => {

    const { doctorId, startDate, endDate } = useLocation().state
    //======================================================
    //======================================================

    const [beginDay, setBeginDay] = useState(startDate);
    const [endDay, setEndDay] = useState(endDate);

    //======================================================
    //======================================================

    const { request, loading } = useHttp();
    const auth = useContext(AuthContext);


    //======================================================
    //======================================================
    const {t} = useTranslation()
    //======================================================
    //======================================================
    // Pagination
    const [currentPage, setCurrentPage] = useState(0)
    const [countPage, setCountPage] = useState(10)

    const indexLastConnector = (currentPage + 1) * countPage
    const indexFirstConnector = indexLastConnector - countPage

    //======================================================
    //======================================================

    const toast = useToast();

    const notify = useCallback(
        (data) => {
            toast({
                title: data.title && data.title,
                description: data.description && data.description,
                status: data.status && data.status,
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
        },
        [toast]
    );

    //======================================================
    //======================================================

    const [doctors, setDoctors] = useState([])
    const [currentDoctors, setCurrentDoctors] = useState([])
    const [searchStorage, setSearchStrorage] = useState([])

    const getDirectDoctors = useCallback(
        async (beginDay, endDay) => {
            try {
                const data = await request(
                    `/api/doctor/directdoctors/services/get`,
                    "POST",
                    { doctor: doctorId, beginDay, endDay },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                setDoctors(data)
                setSearchStrorage(data)
                setCurrentDoctors(
                    data.slice(indexFirstConnector, indexLastConnector),
                )
            } catch (error) {
                notify({
                    title: error,
                    description: "",
                    status: "error",
                });
            }
        },
        [request, auth, notify, doctorId]
    );

    //=======================================================
    //=======================================================

    const [departments, setDepartments] = useState([])

    const getDepartments = useCallback(async () => {
        try {
            const data = await request(
                `/api/services/department/getall`,
                'POST',
                { clinica: auth.clinica._id },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            setDepartments([...data].map((deparmtent) => ({
                label: deparmtent.name,
                value: deparmtent._id
            })))
        } catch (error) {
            notify({
                title: error,
                description: '',
                status: 'error',
            })
        }
    }, [request, auth, notify])

    //=======================================================
    //=======================================================

    const changeStart = (e) => {
        setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
        getDirectDoctors(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay);
    };

    const changeEnd = (e) => {
        const date = new Date(new Date(e).setUTCHours(23, 59, 59, 59))

        setEndDay(date);
        getDirectDoctors(beginDay, date);
    }

    //=======================================================
    //=======================================================

    //=======================================================
    //=======================================================

    const setPageSize =
        (e) => {
            if (e.target.value === 'all') {
                setCurrentPage(0)
                setCountPage(e.target.value)
                setCurrentDoctors(doctors)
            } else {
                setCurrentPage(0)
                setCountPage(e.target.value)
                setCurrentDoctors(doctors.slice(0, e.target.value))
            }
        }

    const searchFullname =
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.service.service.name
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()))
            setDoctors(searching)
            setCurrentDoctors(searching.slice(0, countPage))
        }

    //=======================================================
    //=======================================================

    // const [t, setT] = useState(0);

    useEffect(() => {
        getDirectDoctors(startDate, endDate)
    }, [getDirectDoctors, startDate, endDate])

    useEffect(() => {
        getDepartments()
    }, [getDepartments])


    return (
        <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
            <div className="border-0 table-container">
                <div className="border-0 table-container">
                        <div className="bg-white flex gap-4 items-center p-2">
                            <div>
                                <select
                                    className="form-control form-control-sm selectpicker"
                                    placeholder="Bo'limni tanlang"
                                    onChange={setPageSize}
                                    style={{ minWidth: "50px" }}
                                >
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={'all'}>Barchasi</option>
                                </select>
                            </div>
                            <div>
                                <input
                                    onChange={searchFullname}
                                    style={{ minWidth: "100px" }}
                                    type="search"
                                    className="w-100 form-control form-control-sm selectpicker"
                                    placeholder={t("Xizmat")}
                                />
                            </div>
                            <div className="w-[300px]">
                                <Select
                                    options={[
                                        {
                                            label: 'Xammasi',
                                            value: "all"
                                        },
                                        ...departments
                                    ]}
                                    onChange={(e) => {
                                        if (e.value === 'all') {
                                            setDoctors(searchStorage)
                                            setCurrentDoctors(searchStorage)
                                        } else {
                                            setDoctors([...searchStorage].filter(i => i.service.department._id === e.value))
                                            setCurrentDoctors([...searchStorage].filter(i => i.service.department._id === e.value))
                                        }
                                    }}
                                    placeholder={t('Tanlang...')}
                                />
                            </div>
                            <div
                                className="text-center ml-auto flex gap-2"
                                style={{ overflow: 'hidden' }}
                            >
                                <DatePickers value={new Date(beginDay).toISOString().slice(0, 10)} changeDate={changeStart} />
                                <DatePickers value={new Date(endDay).toISOString().slice(0, 10)} changeDate={changeEnd} />
                            </div>
                            <div className="text-center ml-auto mr-4">
                                <Pagination
                                    setCurrentDatas={setCurrentDoctors}
                                    datas={doctors}
                                    setCurrentPage={setCurrentPage}
                                    countPage={countPage}
                                    totalDatas={doctors.length}
                                />
                            </div>
                            <div className="text-center">
                                <div className="btn btn-primary">
                                    <ReactHtmlTableToExcel
                                        id="reacthtmltoexcel"
                                        table="directservices"
                                        sheet="Sheet"
                                        buttonText="Excel"
                                        filename="Yunaltiruvchi shifokor"
                                    />
                                </div>
                            </div>
                        </div>
                        <table className="table m-0 table-sm" id="directservices">
                            <thead>
                                <tr>
                                    <th className="border py-1 bg-alotrade text-[16px]">№</th>
                                    <th className="border py-1 bg-alotrade text-[16px]">
                                        {t("Xizmat")}
                                    </th>
                                    <th className="border py-1 bg-alotrade text-[16px]">
                                        {t("Bo'lim")}
                                    </th>
                                    <th className="border py-1 bg-alotrade text-[16px]">
                                        {t("Soni")}
                                    </th>
                                    <th className="border py-1 bg-alotrade text-[16px]">
                                        {t("Narxi")}
                                    </th>
                                    <th className="border py-1 bg-alotrade text-[16px]">{t("Umumiy narxi")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentDoctors.map((doctor, key) => {
                                    return (
                                        <tr key={key}>
                                            <td
                                                className={`border py-1 font-weight-bold text-right text-[16px]`}
                                                style={{ maxWidth: "30px !important" }}
                                            >
                                                {currentPage * countPage + key + 1}
                                            </td>
                                            <td className="border py-1 text-[16px] font-weight-bold">
                                                {doctor?.service?.service?.name}
                                            </td>
                                            <td className="border py-1 text-[16px] text-center">
                                                {doctor?.service?.department?.name}
                                            </td>
                                            <td className="border py-1 text-[16px] text-right">
                                                {doctor?.service?.pieces}
                                            </td>
                                            <td className="border py-1 text-[16px] text-right">
                                                {doctor?.service?.service?.price}
                                            </td>
                                            <td className="border py-1 text-[16px] text-right">
                                                {doctor?.service?.pieces * doctor?.service?.service?.price}
                                            </td>
                                        </tr>
                                    );
                                })}
                                <tr>
                                    <td
                                        className={`border py-1 font-weight-bold text-right text-[16px]`}
                                        style={{ maxWidth: "30px !important" }}
                                    >
                                    </td>
                                    <td className="border py-1 text-[16px] font-weight-bold"></td>
                                    <td className="border py-1 text-[16px] text-center"></td>
                                    <td className="border py-1 text-[16px] text-right"></td>
                                    <td className="border py-1 text-[16px] text-center"></td>
                                    <td className="border py-1 text-[16px] text-right font-bold">
                                        {searchStorage.reduce((prev, el) => prev + (el?.service?.pieces * el?.service?.service?.price || 0), 0)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                </div>
            </div>
        </div>
    )
}

export default DirectServices;