import { type DateValue } from '@internationalized/date';
import { getContext, hasContext, setContext } from 'svelte';
import { toast } from 'svelte-sonner';

export default class ReservationManager {
	static #contextID = 'reservation-manager';

	tabs: { value: Tabs; label: string }[] = [];
	#index: number = $derived(this.tabs.findIndex((el) => el.value === this.tab) ?? 0);
	tab: Tabs = $state('date');

	name: string = $state('');
	surname: string = $state('');
	email: string = $state('');
	date: DateValue | undefined = $state();
	hour: string = $state('');

	//TODO
	service: string = $state('1');

	private constructor() {
		this.date = undefined;
		this.hour = '';
		this.email = '';
		this.service = '1';
		this.tabs = [
			{ value: 'date', label: 'Data' },
			{ value: 'service', label: 'Servizi' },
			{ value: 'info', label: 'Informazioni' }
		];
	}

	static istance(): ReservationManager {
		if (hasContext(this.#contextID)) {
			return getContext(this.#contextID);
		} else {
			return setContext(this.#contextID, new ReservationManager());
		}
	}

	check(): boolean {
		if (!this.date || !this.hour) {
			toast.error('Devi inserire una data per poter proseguire');
			this.goToTab('date');
			return true;
		} else if (!this.service) {
			toast.error('Devi inserire un servizio per poter proseguire ');
			this.goToTab('service');
			return true;
		} else if (!this.name || !this.surname || !this.email) {
			toast.error('Devi inserire i tuoi nominativi');
			this.goToTab('info');
			return true;
		} else {
			return false;
		}
	}

	next() {
		this.tab = this.tabs[this.#index + 1].value;
	}

	back() {
		this.tab = this.tabs[this.#index - 1].value;
	}

	isFirst() {
		if (this.#index === 0) {
			return true;
		} else {
			return false;
		}
	}

	isLast() {
		if (this.#index === this.tabs.length - 1) {
			return true;
		} else {
			return false;
		}
	}

	goToTab(tab: Tabs) {
		this.tab = tab;
	}
}

type Tabs = 'date' | 'service' | 'info';
