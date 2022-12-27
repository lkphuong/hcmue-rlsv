// import { SheetEntity } from '../../../entities/sheet.entity';
// import { ConfigurationService } from '../../shared/services/configuration/configuration.service';

// import { Configuration } from '../../shared/constants/configuration.enum';
// import { SheetPayload } from '../interfaces/payloads/sheet_payload.interface';

// export const generateCreateSheetEntities = async (
//   items: SheetPayload[],
//   configuration_service: ConfigurationService,
// ) => {
//   //#region Get items per page
//   const items_per_page = parseInt(
//     configuration_service.get(Configuration.ITEMS_PER_PAGE),
//   );
//   //#endregion

//   //#region Generate sheets entities
//   const sheets: SheetEntity[] = [];
//   for await (const item of items) {
//     const sheet = new SheetEntity();
//     sheet.form = item.form;
//     sheet.department_id = item.department_id;
//     sheet.class_id = item.class_id;
//     sheet.k = item.k;
//     sheet.semester = item.semester;
//     sheet.academic_year = item.academic_year;
//     sheet.user_id = item.user_id;
//     sheet.level = null;
//     sheets.push(sheet);

//     if (sheets.length === items_per_page || item.flag) {
//       break;
//     }
//   }
//   //#endregion

//   return sheets;
// };
