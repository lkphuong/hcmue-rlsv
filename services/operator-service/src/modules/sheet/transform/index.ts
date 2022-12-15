import { ApprovalEntity } from '../../../entities/approval.entity';
import { SheetEntity } from '../../../entities/sheet.entity';

import { ApprovedStatus } from '../constants/enums/approved_status.enum';

export const generateApproval2Array = async (sheets: SheetEntity[] | null) => {
  if (sheets && sheets.length > 0) {
    const payload: ApprovalEntity[] = [];
    for await (const sheet of sheets) {
      if (sheet.approvals && sheet.approvals.length > 0) {
        for await (const approval of sheet.approvals) {
          approval.approved_status = ApprovedStatus.OVERDUE;
          approval.updated_at = new Date();
          approval.updated_by = 'system';

          payload.push(approval);
        }
      }
    }

    return payload;
  }
  return null;
};

export const generateSheet2Array = async (sheets: SheetEntity[] | null) => {
  if (sheets && sheets.length > 0) {
    const payload: SheetEntity[] = [];
    for await (const sheet of sheets) {
      sheet.approvals = null;
      sheet.status += sheet.status !== 0 ? (sheet.status % 2 == 0 ? 2 : 1) : 0;
      sheet.updated_at = new Date();
      sheet.updated_by = 'system';

      payload.push(sheet);
    }

    return payload;
  }

  return null;
};
