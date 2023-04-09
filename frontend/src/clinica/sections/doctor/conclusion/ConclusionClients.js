import { useToast } from "@chakra-ui/react";
import { faAngleDown, faAngleUp, faPenAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import { Pagination } from "../components/Pagination";
import Print from "../components/Print";
import { DatePickers } from "../doctorclients/clientComponents/DatePickers";


export const ConclusionClients = () => {
  const [beginDay, setBeginDay] = useState(
    new Date(new Date().setUTCHours(0, 0, 0, 0))
  );
  const [endDay, setEndDay] = useState(
    new Date(new Date().setDate(new Date().getDate() + 1))
  );
  //====================================================================
  //====================================================================

  const history = useHistory()

  //====================================================================
  //====================================================================
  // RegisterPage
  const [visible, setVisible] = useState(false);

  const changeVisible = () => setVisible(!visible);

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [countPage, setCountPage] = useState(10);

  const indexLastConnector = (currentPage + 1) * countPage;
  const indexFirstConnector = indexLastConnector - countPage;

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
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
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const { request, loading } = useHttp();
  const auth = useContext(AuthContext);

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // getConnectors
  const [doctorClients, setDoctorClients] = useState([]);
  const [searchStorage, setSearchStorage] = useState([]);
  const [currentDoctorClients, setCurrentDoctorClients] = useState([]);

  const getDoctorClients = useCallback(
    async (beginDay, endDay) => {
      try {
        const data = await request(
          `/api/doctor/clients/statsionarclients/get`,
          "POST",
          {
            clinica: auth && auth.clinica._id,
            beginDay,
            endDay,
            department: auth?.user?.specialty,
          },
          {
            Authorization: `Bearer ${auth.token}`,
          }
        );
        setDoctorClients(data);
        setSearchStorage(data);
        setCurrentDoctorClients(
          data.slice(indexFirstConnector, indexLastConnector)
        );
      } catch (error) {
        notify({
          title: error,
          description: "",
          status: "error",
        });
      }
    },
    [request, auth, notify, indexFirstConnector, indexLastConnector]
  );

  //===================================================================
  //===================================================================

  //===================================================================
  //===================================================================
  // Searching

  const searchFullname = useCallback(
    (e) => {
      const searching = searchStorage.filter((item) =>
        item.client.fullname
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
      );
      setDoctorClients(searching);
      setCurrentDoctorClients(searching.slice(0, countPage));
    },
    [searchStorage, countPage]
  );

  const searchId = useCallback(
    (e) => {
      const searching = searchStorage.filter((item) =>
        item.client.id.toString().includes(e.target.value)
      );
      setDoctorClients(searching);
      setCurrentDoctorClients(searching.slice(0, countPage));
    },
    [searchStorage, countPage]
  );

  //===================================================================
  //===================================================================

  const setPageSize =
    (e) => {
      setCurrentPage(0);
      setCountPage(e.target.value);
      setCurrentDoctorClients(searchStorage.slice(0, e.target.value));
    }

  //====================================================================
  //====================================================================
  // ChangeDate

  const changeStart = (e) => {
    setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
    getDoctorClients(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay)
  };

  const changeEnd = (e) => {
    const date = new Date(
      new Date(new Date().setDate(new Date(e).getDate() + 1)).setUTCHours(
        0,
        0,
        0,
        0
      )
    );

    setEndDay(date);
    getDoctorClients(beginDay, date)
  };

  //====================================================================
  //====================================================================

  const [baseUrl, setBaseurl] = useState();

  const getBaseUrl = useCallback(async () => {
    try {
      const data = await request(`/api/baseurl`, "GET", null);
      setBaseurl(data.baseUrl);
    } catch (error) {
      notify({
        title: error,
        description: "",
        status: "error",
      });
    }
  }, [request, notify]);

  //====================================================================
  //====================================================================
  // useEffect

  const [t, setT] = useState(0);

  useEffect(() => {
    if (auth.clinica && !t) {
      setT(1);
      getDoctorClients(beginDay, endDay);
      getBaseUrl()
    }
  }, [auth, beginDay, t, endDay, getDoctorClients, getBaseUrl]);

  console.log(currentDoctorClients);
  const componentRef = useRef()
  const print = useReactToPrint({
    content: () => componentRef.current,
  })

  const [printBody, setPrintBody] = useState({
    connector: {},
    client: {},
    services: []
  })
  const handlePrint = (connector) => {
    setPrintBody(connector)
    setTimeout(() => {
      print()
    }, 1000)
  }

  //=====================================================================
  //=====================================================================

  return (
    <>
      <div className="d-none">
        <div
          ref={componentRef}
          className="container p-4"
          style={{ fontFamily: "times" }}
        >
          <Print
            doctor={auth.user}
            connector={printBody.connector}
            client={printBody.client}
            sections={printBody.services}
            clinica={auth && auth.clinica}
            baseUrl={baseUrl}
          />
        </div>
      </div>
      <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
        <div className="row gutters">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <div className="row">
              <div className="col-12 text-end">
                <button
                  className={`btn bg-alotrade text-white mb-2 w-100`}
                  onClick={() => setVisible(!visible)}
                >
                  Malumot
                </button>
              </div>
            </div>
            <div className="border-0 shadow-lg table-container">
              <div className="border-0 table-container">
                <div className="table-responsive">
                  <table className="table m-0" id="discount-table">
                    <thead className="bg-white">
                      <tr>
                        <th>
                          <select
                            className="form-control form-control-sm selectpicker"
                            placeholder="Bo'limni tanlang"
                            onChange={setPageSize}
                            style={{ minWidth: "50px" }}
                          >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                          </select>
                        </th>
                        <th>
                          <input
                            onChange={searchFullname}
                            style={{ maxWidth: "100px", minWidth: "100px" }}
                            type="search"
                            className="w-100 form-control form-control-sm selectpicker"
                            placeholder="F.I.O"
                          />
                        </th>
                        <th>
                          <input
                            onChange={searchId}
                            style={{ maxWidth: "60px" }}
                            type="search"
                            className="form-control form-control-sm selectpicker"
                            placeholder="ID"
                          />
                        </th>
                        <th className="text-center">
                          <Pagination
                            setCurrentDatas={setCurrentDoctorClients}
                            datas={doctorClients}
                            setCurrentPage={setCurrentPage}
                            countPage={countPage}
                            totalDatas={doctorClients.length}
                          />
                        </th>
                        <th
                          className="flex items-center gap-2 justify-center"
                          style={{ maxWidth: "200px", overflow: "hidden" }}
                        >
                          <DatePickers changeDate={changeStart} />
                          <DatePickers changeDate={changeEnd} />
                        </th>
                      </tr>
                    </thead>
                    <thead>
                      <tr>
                        <th className="border bg-alotrade text-[16px] py-1">№</th>
                        <th className="border bg-alotrade text-[16px] py-1">
                          F.I.O
                          <div className="btn-group-vertical ml-2">
                            <FontAwesomeIcon
                              onClick={() =>
                                setCurrentDoctorClients(
                                  [...currentDoctorClients].sort((a, b) =>
                                    a.client.fullname > b.client.fullname ? 1 : -1
                                  )
                                )
                              }
                              icon={faAngleUp}
                              style={{ cursor: "pointer" }}
                            />
                            <FontAwesomeIcon
                              icon={faAngleDown}
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                setCurrentDoctorClients(
                                  [...currentDoctorClients].sort((a, b) =>
                                    b.client.fullname > a.client.fullname ? 1 : -1
                                  )
                                )
                              }
                            />
                          </div>
                        </th>
                        <th className="border bg-alotrade text-[16px] py-1">
                          ID
                          <div className="btn-group-vertical ml-2">
                            <FontAwesomeIcon
                              onClick={() =>
                                setCurrentDoctorClients(
                                  [...currentDoctorClients].sort((a, b) =>
                                    a.client.id > b.client.id ? 1 : -1
                                  )
                                )
                              }
                              icon={faAngleUp}
                              style={{ cursor: "pointer" }}
                            />
                            <FontAwesomeIcon
                              icon={faAngleDown}
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                setCurrentDoctorClients(
                                  [...currentDoctorClients].sort((a, b) =>
                                    b.client.id > a.client.id ? 1 : -1
                                  )
                                )
                              }
                            />
                          </div>
                        </th>
                        <th className="border bg-alotrade text-[16px] py-1">
                          Telefon raqami
                          <div className="btn-group-vertical ml-2">
                            <FontAwesomeIcon
                              onClick={() =>
                                setCurrentDoctorClients(
                                  [...currentDoctorClients].sort((a, b) =>
                                    a.client.phone > b.client.phone ? 1 : -1
                                  )
                                )
                              }
                              icon={faAngleUp}
                              style={{ cursor: "pointer" }}
                            />
                            <FontAwesomeIcon
                              icon={faAngleDown}
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                setCurrentDoctorClients(
                                  [...currentDoctorClients].sort((a, b) =>
                                    b.client.phone > a.client.phone ? 1 : -1
                                  )
                                )
                              }
                            />
                          </div>
                        </th>
                        <th className="border bg-alotrade text-[16px] py-1">
                          Tugilgan yili
                          <div className="btn-group-vertical ml-2">
                            <FontAwesomeIcon
                              onClick={() =>
                                setCurrentDoctorClients(
                                  [...currentDoctorClients].sort((a, b) =>
                                    a.client.born > b.client.born ? 1 : -1
                                  )
                                )
                              }
                              icon={faAngleUp}
                              style={{ cursor: "pointer" }}
                            />
                            <FontAwesomeIcon
                              icon={faAngleDown}
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                setCurrentDoctorClients(
                                  [...currentDoctorClients].sort((a, b) =>
                                    b.client.born > a.client.born ? 1 : -1
                                  )
                                )
                              }
                            />
                          </div>
                        </th>
                        <th className="border bg-alotrade text-[16px] py-1">
                          
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentDoctorClients.length > 0 &&
                        currentDoctorClients.map((connector, key) => {
                          return (
                            <tr key={key}>
                              <td
                                className="border text-[16px] py-1 font-weight-bold text-right"
                                style={{ maxWidth: "30px !important" }}
                              >
                                {currentPage * countPage + key + 1}
                              </td>
                              <td className="border text-[16px] py-1 font-weight-bold">
                                {connector.client.firstname} {connector.client.lastname}
                              </td>
                              <td className="border text-[16px] py-1 text-right">
                                {connector.client.id}
                              </td>
                              <td className="border text-[16px] py-1 text-right">
                                {connector.client.phone}
                              </td>
                              <td className="border text-[16px] py-1 text-right">
                                {new Date(connector.client.born).toLocaleDateString()}
                              </td>
                              <td className="border text-[16px] py-1 text-center flex gap-[4px] items-center">
                                <button
                                  onClick={() =>
                                    history.push("/alo24/conclusion", {...connector})
                                  }
                                  className="btn btn-primary py-0"
                                >
                                  <FontAwesomeIcon icon={faPenAlt} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
