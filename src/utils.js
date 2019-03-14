const businessCards = [
  'businessCard',
  'businessCardClient',
  'businessCardClients',
  'businessCardEmployee',
  'businessCardFilal',
  'businessCardServiceGallery',
  'businessCardEmployeeGallery',
  'businessCardService',
  'businessVisit',
  'employeeCard',
  'employeeFull',
  'companyGallery',
  'companyAlbum',
  'companyServicesGallery',
  'companyEmployeesGallery',
  'employeeGallery',
  'serviceAlbum'
]

export function isBusinessRoute (routeName) {
  return businessCards.some(x => x === routeName)
}
