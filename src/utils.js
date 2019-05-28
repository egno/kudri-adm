const businessCards = [
  'businessCard',
  'businessCardClient',
  'BusinessClientsTable',
  'employeeList',
  'filialList',
  'businessCardServiceGallery',
  'businessCardEmployeeGallery',
  'services',
  'businessSettings',
  'widgetSettings',
  'visitCalendar',
  'employeeCard',
  'employeeProfile',
  'companyGallery',
  'companyAlbum',
  'companyServicesGallery',
  'companyEmployeesGallery',
  'employeeGallery',
  'serviceAlbum',
  'businessUsers',
  'businessUser'
]

export function isBusinessRoute (routeName) {
  return businessCards.some(x => x === routeName)
}
