import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAngleUp,
  faAngleDown,
  faPenAlt,
  faPrint,
  faPlus,
  faSearch,
  faRotate,
  faSquare,
  faPenSquare,
  faPenToSquare,
  faUserPen,
  faArrowsLeftRightToLine,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons'
import { Sort } from './Sort'
import { Pagination } from '../../components/Pagination'
import { DatePickers } from './DatePickers'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export const TableClients = ({
  baseUrl,
  setVisible,
  setCheck,
  setModal1,
  modal,
  changeStart,
  changeEnd,
  searchPhone,
  setClient,
  searchId,
  searchFullname,
  searchProbirka,
  connectors,
  setConnector,
  setCurrentPage,
  countPage,
  currentConnectors,
  setCurrentConnectors,
  currentPage,
  setPageSize,
  loading,
  getConnectorsByClientBorn,
  setClientDate,
  setIsAddConnector,
  getClientsById,
  setPrintBody,
  handlePrint,
  allModalHandle,
  getByClientName,
  getByClientPhone,
  setIsAddService,
  changeStep,
  listType,
  showSmallCehck,
  changeAfterClient,
  showSmallCehck2,
  showSmallCehckReturn,
  handleAccessNext,
  departments,
  selectDepartment,
  setDepartsList
}) => {

  const { t } = useTranslation()

  const history = useHistory()
  const [clientBorn, setClientBorn] = useState('')

  const setColor = (connector) => {
    if (!connector.stepAccess) {
      return 'bg-gray-400'
    }
    if (connector.stepAccess) {
      return 'bg-green-400'
    }
    return ''
  }

  const getTurnStepClient = (connector) => {
    const depart = connector.services.filter(el => el.department.probirka === false)[0]?.department?._id
    const data = [...currentConnectors].filter(el => el.step && el.services.some(el => el.department._id === depart)).sort((a, b) => new Date(a.stepDate) - new Date(b.stepDate))
    const index = data.reduce((prev, el, ind) => {
      if (connector._id === el._id) {
        prev = ind
      }
      return prev;
    }, 0)
    return index + 1
  }

  return (
    <div className="border-0 table-container">
      <div className="border-0 table-container">
        <div className="table-responsive">
          <div className="bg-white flex gap-6 items-center py-2 px-2">
            {/* <div>
              <select
                className="form-control form-control-sm selectpicker"
                placeholder="Bo'limni tanlang"
                onChange={setPageSize}
                style={{ minWidth: '50px' }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div> */}
            <div>
              <input
                onChange={searchFullname}
                style={{ maxWidth: '100px', minWidth: '100px' }}
                type="search"
                className="w-100 form-control form-control-sm selectpicker"
                placeholder={t("F.I.O")}
                onKeyDown={(e) => e.key === 'Enter' && getByClientName()}
              />
            </div>
            <div>
              <input
                onChange={searchPhone}
                style={{ maxWidth: '100px', minWidth: '100px' }}
                type="search"
                className="w-100 form-control form-control-sm selectpicker"
                placeholder={t("Tel")}
                onKeyDown={(e) => e.key === 'Enter' && getByClientPhone()}
              />
            </div>
            <div>
              <input
                onChange={searchId}
                style={{ maxWidth: '80px' }}
                type="search"
                className="form-control form-control-sm selectpicker"
                placeholder={t("ID")}
                onKeyDown={(e) => e.key === 'Enter' && getClientsById()}
              />
            </div>
            {/* <div>
              <input
                onChange={searchProbirka}
                style={{ maxWidth: '70px' }}
                type="search"
                className="form-control form-control-sm selectpicker"
                placeholder={t("Probirka")}
              />
            </div> */}
            <div className="flex items-center gap-4">
              <input
                onKeyDown={(e) => e.key === 'Enter' && getConnectorsByClientBorn(e.target.value)}
                type="date"
                name="born"
                onChange={(e) => setClientBorn(e.target.value)}
                className="form-control inp"
                placeholder=""
                style={{ color: '#999' }}
              />
              <button onClick={() => getConnectorsByClientBorn(clientBorn)}>
                <FontAwesomeIcon
                  icon={faSearch}
                  style={{ cursor: "pointer" }}
                />
              </button>
            </div>
            {listType !== 'operation' && <div className="text-center ml-auto ">
              <select
                className="form-control form-control-sm selectpicker"
                placeholder="Reklamalarni tanlash"
                onChange={selectDepartment}
              >
                <option value="all">{t("Barcha bo'limlar")}</option>
                {departments.map((department, index) => {
                  return (
                    <option key={index} value={department._id}>
                      {department.name}
                    </option>
                  );
                })}
              </select>
            </div>}
            <div
              className="text-center ml-auto flex gap-2"
              style={{ overflow: 'hidden' }}
            >
              <DatePickers changeDate={changeStart} />
              <DatePickers changeDate={changeEnd} />
            </div>
          </div>
          <table className="table m-0">
            <thead>
              <tr>
                <th className="border py-1 bg-alotrade text-[16px]">№</th>
                <th className="border py-1 bg-alotrade text-[16px]">
                  {t("F.I.O")}
                </th>
                <th className='border py-1 bg-alotrade text-[16px]'>{t("Tel")}</th>
                <th className="border py-1 bg-alotrade text-[16px]">
                  {t("Tug'ilgan sa'nasi")}
                </th>
                {/* <th className="border py-1 bg-alotrade text-[16px]">
                  {t("Probirka")}
                </th> */}
                <th className="border py-1 bg-alotrade text-[16px]">
                  {t("Xizmatlar")}
                </th>
                <th className="border py-1 bg-alotrade text-[16px]">
                  {t("Navbat")}
                </th>
                <th className="border py-1 bg-alotrade text-[16px]">
                  {t("Kelgan vaqti")}
                </th>
                <th className="border py-1 bg-alotrade text-[16px]">
                  {t("Qo'shish")}
                </th>
                <th className="border py-1 bg-alotrade text-[16px]">

                </th>
                <th className="border py-1 bg-alotrade text-[16px]">
                  {t("Chop etish")}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentConnectors.map((connector, key) => {
                return (
                  <tr key={key}>
                    <td
                      className={`border py-1 font-weight-bold text-right ${setColor(connector)}`}
                      style={{ maxWidth: '30px !important' }}
                    >
                      {currentPage * countPage + key + 1}
                    </td>
                    <td className="border py-1 font-weight-bold text-[16px]">
                      {connector?.client?.fullname}
                    </td>
                    <td className="border py-1 text-right text-[16px]">
                      +998{connector?.client?.phone}
                    </td>
                    <td className="border py-1 text-right text-[16px]">
                    {new Date(connector?.client?.born).toLocaleDateString()}
                    </td>
                    {/* <td className="border py-1 text-right text-[16px]">
                      {connector?.probirka}
                    </td> */}
                    <td className="border py-1 text-right text-[16px]">
                      <button onClick={() => {
                        allModalHandle(connector.services, connector, connector.client)
                      }}>
                        <span className={`${connector.services.filter(service => !service.refuse).length === connector.services.filter(service => service.accept).length ? 'text-green-400' : "text-red-400"}`}>{connector.services.filter(service => !service.refuse).length}</span> / <span className='text-green-400'>{connector.services.filter(service => service.accept).length}</span>
                      </button>
                    </td>
                    {/* <td className="border py-1 text-right text-[16px]">
                      {[...connector?.services].filter(service => service.department.probirka === false)[0]?.department?.name || [...connector?.services].filter(service => service.department.probirka)[0]?.department?.name}
                    </td> */}
                    <td className={`border py-1 text-right text-[16px] font-bold ${listType === 'all' && connector.isBooking && "bg-green-400"}`}
                      onClick={() => setDepartsList(connector)}
                    >
                      {listType === 'all' && connector?.isBooking ? t('Belgilangan') : `${listType === 'operation' ? 'ПО' : connector.step ? 'KO' : connector.services.filter(i => !i.department.probirka)[0]?.department?.turntitle || 'L'} ${listType === 'operation' ? connector?.turn : (listType === 'nextsteps' && connector?.step ? getTurnStepClient(connector) : [...connector?.services].filter(service => service.department.probirka === false)[0]?.turn || [...connector?.services].filter(service => service.department.probirka)[0]?.turn)}`}
                    </td>
                    <td className="border py-1 text-right text-[16px]">
                      {`${new Date(connector?.createdAt).toLocaleDateString()} ${new Date(connector?.createdAt).toLocaleTimeString()}`}
                    </td>
                    <td className="border py-1 text-center text-[16px]">
                      <button
                        className="bg-green-500 border-green-500 hover:bg-green-400 btn btn-success py-0"
                        onClick={() => {
                            setClient({ ...connector.client })
                            setClientDate(connector.client.born.slice(0, 10))
                            setConnector({
                              ...connector,
                              _id: connector._id,
                              services: [...connector.services],
                            })
                            setIsAddConnector(false);
                            setVisible(true);
                            setIsAddService(true)
                        }}
                      >
                        <FontAwesomeIcon icon={faUserPen} />
                      </button>
                    </td>
                    <td className="border py-1 text-right text-[16px]">
                      <div className='flex flex-row justify-center items-center  pt-[1.25rem] pb-[1.25rem] pr-[.625rem] pl-[.625rem] gap-[1.25rem]'>
                        <div className='flex items-center gap-[.625rem]'>
                          <input type='checkbox' checked={connector?.stepAccess}
                            onChange={() => handleAccessNext(connector?._id, connector.stepAccess ? false : true)} />
                        </div>
                      </div>
                    </td>
                    <td className="border py-1 text-center text-[16px]">
                      {loading ? (
                        <button className="btn btn-success" disabled>
                          <span className="spinner-border spinner-border-sm"></span>
                          Loading...
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary py-0"
                          onClick={() => {
                            if (listType === 'nextsteps') {
                              showSmallCehck(connector)
                            }
                            if (listType === 'operation') {
                              showSmallCehck2(connector)
                            }
                            if (listType === 'all') {
                              showSmallCehckReturn(connector)
                            }
                          }}
                        >
                          <FontAwesomeIcon icon={faPrint} />
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
