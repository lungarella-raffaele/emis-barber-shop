<script lang="ts">
	import Modeswitcher from '$lib/components/app/modeswitcher.svelte';
	import Profile from '$lib/components/app/profile.svelte';
	import { Button } from '$lib/components/ui/button';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import House from 'lucide-svelte/icons/house';
	import LogOut from 'lucide-svelte/icons/log-out';
	import User from 'lucide-svelte/icons/user';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';

	let { data, children } = $props();

	let profileDialog = $state(false);
	const toggleDialog = () => {
		profileDialog = !profileDialog;
	};
</script>

<main class="p-2">
	<ModeWatcher />
	<div class="mb-6 flex items-center justify-between py-6">
		<!-- LEADING -->
		<div class="flex items-center">
			<Button href="/" variant="ghost" size="icon">
				<House />
			</Button>
		</div>

		<!-- TRAILING -->
		<div class="flex items-center">
			{#if !data.user}
				<Button href="/login" variant="ghost">Login</Button>
			{:else}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost' })}>
						<span class="font-bold">
							{data.user.email.slice(0, 1).toUpperCase()}
						</span>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Item onSelect={toggleDialog}>
							<User class="mr-2 size-4" />
							<span>Profile</span>
						</DropdownMenu.Item>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>
							<a class="flex items-center" href="/logout" data-sveltekit-reload aria-label="Logout">
								<LogOut class="mr-2 size-4" />
								<span>Log out</span>
							</a>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{/if}
			<Modeswitcher />
		</div>
	</div>
	{@render children()}
</main>

{#if data.user}
	<Profile bind:open={profileDialog} user={data.user} />
{/if}
