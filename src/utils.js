const businessCards = [
  'businessCard',
  'businessCardClient',
  'BusinessClientsTable',
  'employeeList',
  'businessCardFilial',
  'businessCardServiceGallery',
  'businessCardEmployeeGallery',
  'services',
  'businessSettings',
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
