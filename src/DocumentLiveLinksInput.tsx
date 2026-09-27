import { type ObjectInputProps } from 'sanity';
import { LiveSiteLinksPanel } from './LiveSiteLinksPanel';

type DocumentLiveLinksInputProps = ObjectInputProps & {
	documentType: string;
};

export function DocumentLiveLinksInput(props: DocumentLiveLinksInputProps) {
	const { documentType, renderDefault } = props;

	return (
		<>
			<LiveSiteLinksPanel documentType={documentType} />
			{renderDefault(props)}
		</>
	);
}
