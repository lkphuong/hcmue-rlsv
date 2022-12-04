import { PipelineStage, Types } from 'mongoose';
import { convertString2ObjectId } from '../../../utils';

export const generateCountUserPipeline = (
  class_id: string,
  department_id: string,
  input?: string,
) => {
  //#region Where class_id & department_id
  const $criteria: any[] = [
    {
      departmentId: convertString2ObjectId(department_id),
    },
    {
      classId: convertString2ObjectId(class_id),
    },
  ];
  //#endregion

  //#region Where if input != null
  if (input) {
    $criteria.push({
      $or: [
        {
          username: {
            $regex: new RegExp(input, 'i'),
          },
        },
        {
          fullname: {
            $regex: new RegExp(input, 'i'),
          },
        },
      ],
    });
  }
  //#endregion

  //#region Create conditions
  const matchs: PipelineStage[] = [
    {
      $match: {
        $and: $criteria,
      },
    },
  ];
  //#endregion

  //#region Create selection
  const selection: PipelineStage[] = [
    {
      $count: 'count',
    },
  ];
  //#endregion

  //#region Create pipeline
  const pipeline: PipelineStage[] = [...matchs, ...selection];
  //#endregion

  return pipeline;
};

export const generateGetUsersPagingPipeline = (
  offset: number,
  length: number,
  class_id: string,
  department_id: string,
  input?: string,
) => {
  //#region Where class_id & department_id
  const $criteria: { [key: string]: any }[] = [
    {
      departmentId: convertString2ObjectId(department_id),
    },
    {
      classId: convertString2ObjectId(class_id),
    },
  ];
  //#endregion

  //#region Where if input != null
  if (input) {
    $criteria.push({
      $or: [
        {
          username: {
            $regex: new RegExp(input, 'i'),
          },
        },
        {
          fullname: {
            $regex: new RegExp(input, 'i'),
          },
        },
      ],
    });
  }
  //#endregion

  //#region Create conditions
  const matchs: PipelineStage[] = [
    {
      $match: {
        $and: $criteria,
      },
    },
  ];
  //#endregion

  //#region Join to classs collection
  const class_joiner: PipelineStage[] = [
    {
      $lookup: {
        from: 'classs',
        localField: 'classId',
        foreignField: '_id',
        as: 'classs',
      },
    },
    {
      $unwind: {
        path: '$classs',
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
  //#endregion

  //#region Join to classs collection
  const department_joiner: PipelineStage[] = [
    {
      $lookup: {
        from: 'department',
        localField: 'departmentId',
        foreignField: '_id',
        as: 'department',
      },
    },
    {
      $unwind: {
        path: '$department',
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
  //#endregion

  //#region Skip documents
  const limits: PipelineStage[] = [
    {
      $skip: offset,
    },
    {
      $limit: length,
    },
  ];
  //#endregion

  const pipeline: PipelineStage[] = [
    ...class_joiner,
    ...department_joiner,
    ...matchs,
    ...limits,
  ];

  return pipeline;
};

export const generateGetUsersByClassPipeline = (
  class_id: string,
  input?: string,
) => {
  //#region Where class_id & department_id
  const $criteria: { [key: string]: any }[] = [
    {
      classId: convertString2ObjectId(class_id),
    },
  ];
  //#endregion

  //#region Where if input != null
  if (input) {
    $criteria.push({
      $or: [
        {
          username: {
            $regex: new RegExp(input, 'i'),
          },
        },
        {
          fullname: {
            $regex: new RegExp(input, 'i'),
          },
        },
      ],
    });
  }
  //#endregion

  //#region Create conditions
  const matchs: PipelineStage[] = [
    {
      $match: {
        $and: $criteria,
      },
    },
  ];
  //#endregion

  const pipeline: PipelineStage[] = [...matchs];
  return pipeline;
};

export const generateGetUserByIdPipeline = (id: string) => {
  //#region Create conditions
  const matchs: PipelineStage[] = [
    {
      $match: {
        _id: convertString2ObjectId(id),
      },
    },
  ];
  //#endregion

  //#region Join to classs collection
  const class_joiner: PipelineStage[] = [
    {
      $lookup: {
        from: 'classs',
        localField: 'classId',
        foreignField: '_id',
        as: 'classs',
      },
    },
    {
      $unwind: {
        path: '$classs',
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
  //#endregion

  //#region Join to classs collection
  const department_joiner: PipelineStage[] = [
    {
      $lookup: {
        from: 'department',
        localField: 'departmentId',
        foreignField: '_id',
        as: 'department',
      },
    },
    {
      $unwind: {
        path: '$department',
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
  //#endregion

  //#region Skip documents
  const limits: PipelineStage[] = [
    {
      $limit: 1,
    },
  ];
  //#endregion

  const pipeline: PipelineStage[] = [
    ...matchs,
    ...class_joiner,
    ...department_joiner,
    ...limits,
  ];

  return pipeline;
};

export const generateGetUserByUserIds = (user_id: Types.ObjectId[]) => {
  //#region Create conditions
  const matchs: PipelineStage[] = [
    {
      $match: {
        _id: {
          $in: user_id,
        },
      },
    },
  ];
  //#endregion

  return matchs;
};
