import { Box, Button, Card, Flex, Stack, Text } from '@sanity/ui';
import { CheckmarkIcon } from '@sanity/icons/Checkmark';
import { ChevronRightIcon } from '@sanity/icons/ChevronRight';
import { CopyIcon } from '@sanity/icons/Copy';
import { DesktopIcon } from '@sanity/icons/Desktop';
import { LaunchIcon } from '@sanity/icons/Launch';
import { useCallback, useMemo, useState, type MouseEvent } from 'react';
import { FormRow, useFormValue } from 'sanity';
import { useLiveLinksConfig } from './context';
import { createLiveSiteUrlHelpers } from './urls';

type LiveLinkLocationItemProps = {
	title: string;
	url: string;
	copied: boolean;
	onCopy: () => void;
};

function LiveLinkLocationItem({ title, url, copied, onCopy }: LiveLinkLocationItemProps) {
	function onCopyClick(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		onCopy();
	}

	return (
		<Card as="a" href={url} target="_blank" rel="noopener noreferrer" padding={3} radius={1} tone="inherit">
			<Flex align="flex-start" gap={3}>
				<Box style={{ flex: 'none' }}>
					<Text size={1}>
						<DesktopIcon />
					</Text>
				</Box>
				<Stack flex={1} gap={2} style={{ minWidth: 0 }}>
					<Text size={1} weight="medium">
						{title}
					</Text>
					<Text muted size={1} textOverflow="ellipsis">
						{url}
					</Text>
				</Stack>
				<Button
					icon={copied ? CheckmarkIcon : CopyIcon}
					mode="bleed"
					padding={2}
					tone={copied ? 'positive' : 'default'}
					onClick={onCopyClick}
					aria-label={copied ? 'Copied' : 'Copy link'}
				/>
			</Flex>
		</Card>
	);
}

type LiveSiteLinksPanelProps = {
	documentType: string;
};

export function LiveSiteLinksPanel({ documentType }: LiveSiteLinksPanelProps) {
	const config = useLiveLinksConfig();
	const slugPath = config.slugPath ?? ['slug', 'current'];
	const titlePath = config.titlePath ?? ['title'];
	const slug = useFormValue(slugPath) as string | undefined;
	const titleValue = useFormValue(titlePath);
	const [expanded, setExpanded] = useState(false);
	const [copiedLocale, setCopiedLocale] = useState<string | null>(null);
	const [copyAllDone, setCopyAllDone] = useState(false);

	const pathContext = useMemo(
		() => ({ documentType, slug: typeof slug === 'string' ? slug : undefined }),
		[documentType, slug]
	);

	const pathBase = useMemo(() => config.resolvePath(pathContext), [config, pathContext]);

	const { liveSiteLinksForPath } = useMemo(
		() => createLiveSiteUrlHelpers(config),
		[config]
	);

	const links = useMemo(() => {
		if (!pathBase) return [];
		return liveSiteLinksForPath(pathBase).map(({ locale, url }) => {
			const title = config.resolveTitle?.({
				...pathContext,
				titleValue
			}) ?? documentType;
			return {
				locale,
				url,
				title: `${title} (${locale.toUpperCase()})`
			};
		});
	}, [config, documentType, liveSiteLinksForPath, pathBase, pathContext, titleValue]);

	const copyToClipboard = useCallback(async (text: string) => {
		if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
			await navigator.clipboard.writeText(text);
			return;
		}

		const textarea = document.createElement('textarea');
		textarea.value = text;
		textarea.setAttribute('readonly', '');
		textarea.style.position = 'absolute';
		textarea.style.left = '-9999px';
		document.body.appendChild(textarea);
		textarea.select();
		document.execCommand('copy');
		document.body.removeChild(textarea);
	}, []);

	const onCopyOne = useCallback(
		async (locale: string, url: string) => {
			try {
				await copyToClipboard(url);
				setCopiedLocale(locale);
				setCopyAllDone(false);
				window.setTimeout(
					() => setCopiedLocale((current) => (current === locale ? null : current)),
					1500
				);
			} catch {
				setCopiedLocale(null);
			}
		},
		[copyToClipboard]
	);

	const onCopyAll = useCallback(async () => {
		if (!links.length) return;
		try {
			await copyToClipboard(links.map(({ url }) => url).join('\n'));
			setCopyAllDone(true);
			setCopiedLocale(null);
			window.setTimeout(() => setCopyAllDone(false), 1500);
		} catch {
			setCopyAllDone(false);
		}
	}, [copyToClipboard, links]);

	const onOpenAll = useCallback(() => {
		for (const { url } of links) {
			window.open(url, '_blank', 'noopener,noreferrer');
		}
	}, [links]);

	const requiresSlug = config.requiresSlug?.includes(documentType) ?? false;
	const missingSlug = requiresSlug && !slug?.trim();
	const hasLinks = links.length > 0;
	const panelTitle = config.panelTitle ?? 'Live links';
	const summary = hasLinks ? `${panelTitle} (${links.length})` : panelTitle;

	return (
		<Box marginBottom={5}>
			<FormRow>
				<Card padding={1} radius={2} border>
					<div style={{ margin: -1 }}>
						<Flex align="center" gap={1}>
							<Box flex={1} style={{ minWidth: 0 }}>
								<Card
									as="button"
									type="button"
									padding={3}
									radius={1}
									tone="inherit"
									onClick={() => setExpanded((value) => !value)}
									style={{ width: '100%', textAlign: 'left' }}
								>
									<Flex align="center" gap={3}>
										<Text size={1}>
											<ChevronRightIcon
												style={{
													transform: expanded ? 'rotate(90deg)' : undefined,
													transition: 'transform 100ms ease-in-out'
												}}
											/>
										</Text>
										<Text size={1} weight="medium">
											{summary}
										</Text>
									</Flex>
								</Card>
							</Box>
							<Flex gap={1} paddingRight={2} style={{ flexShrink: 0 }}>
								<Button
									icon={LaunchIcon}
									mode="bleed"
									text="Open all"
									fontSize={1}
									padding={2}
									disabled={!hasLinks}
									onClick={onOpenAll}
								/>
								<Button
									icon={copyAllDone ? CheckmarkIcon : CopyIcon}
									mode="bleed"
									text="Copy all"
									fontSize={1}
									padding={2}
									disabled={!hasLinks}
									tone={copyAllDone ? 'positive' : 'default'}
									onClick={() => void onCopyAll()}
								/>
							</Flex>
						</Flex>

						<Stack hidden={!expanded} marginTop={1} gap={1}>
							{missingSlug ? (
								<Card padding={3} radius={1} tone="inherit">
									<Text size={1} muted>
										—
									</Text>
								</Card>
							) : (
								links.map(({ locale, url, title }) => (
									<LiveLinkLocationItem
										key={locale}
										title={title}
										url={url}
										copied={copiedLocale === locale}
										onCopy={() => void onCopyOne(locale, url)}
									/>
								))
							)}
						</Stack>
					</div>
				</Card>
			</FormRow>
		</Box>
	);
}
