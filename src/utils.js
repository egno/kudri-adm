const businessCards = [
  'businessCard',
  'businessCardClient',
  'businessCardClients',
  'businessCardEmployee',
  'businessCardFilial',
  'businessCardServiceGallery',
  'businessCardEmployeeGallery',
  'services',
  'businessSettings',
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
