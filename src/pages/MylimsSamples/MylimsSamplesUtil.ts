import { format } from 'date-fns';
import { IDataSample, ISampleAPIResponse } from './MylimsSampleTypes';

export const formatedData = async (
  samples: ISampleAPIResponse[],
): Promise<IDataSample[]> => {
  const dataFormated = samples.map((sample: ISampleAPIResponse) => {
    return {
      id: sample.id,
      sample_type: sample.sample_type,
      taken_date_time: sample.taken_date_time
        ? format(new Date(sample.taken_date_time), 'dd/MM/yyyy HH:mm')
        : '',
      collection_point: sample.collection_point,
      updated_at: sample.updated_at
        ? format(new Date(sample.updated_at), 'dd/MM/yyyy HH:mm')
        : '',
      sample_conclusion: sample.sample_conclusion,
      sample_status: sample.sample_status,
      observation: sample.observation,
      lote: sample.lote,
    };
  });

  await Promise.all(dataFormated);

  return dataFormated as IDataSample[];
};
