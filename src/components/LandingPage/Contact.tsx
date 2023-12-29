'use client'
import React, {useContext, useMemo, useState} from 'react';
import IdeaSvg from '@/assets/images/Idea.svg';
import Image from 'next/image';
import axios from 'axios';
import {contactData, ContactFormFieldKey, ContactFormObject} from '@/constants/contactData';
import useForm, {Validators} from '@/hooks/useForm';
import Snackbar from '@/components/Snackbar';
import {SnackbarContext} from '@/context/SnackbarContext';
import Loader from '@/components/Loader';
import {GTM_EVENT, initGTM, logEvent} from '@/utils/gtm';



export default function Contact() {
	const {values, errors, reset, onChange} = useForm<ContactFormObject>({
		company: {value: '', validators: [Validators.isRequired]},
		email: {value: '', validators: [Validators.isRequired, Validators.isEmail]},
		full_name: {value: '', validators: [Validators.isRequired]},
		message: {value: '', validators: [Validators.isRequired]},
		profession: {value: '', validators: [Validators.isRequired]}
	});
	const [snackBarData, setSnackBarData] = useContext(SnackbarContext).snackBarData;
	const [showError, setShowError] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	function isFormValid() {

	}

	async function handleSubmit() {
		// initGTM();

		logEvent({
			event: GTM_EVENT.CONTACT_FORM_SUBMISSION,
		})

		setShowError(true);
		console.log('errors - ', errors);
		if(errors && Object.keys(errors).length > 0) return;

		setIsSubmitting(true);
		setShowError(false);

		const response = await axios.post('/api/send-mail', {values});

		setIsSubmitting(false);
		reset();
		setSnackBarData({message: response.data.message, status: response.data.ok ? 'success' : 'error'});
	}
	// <div data-groupid={"landing-section"} data-section="bg_attachment" className="w-screen h-[60vh] min-h-[500px]" style={{
	// 	backgroundImage: 'url(/assets/images/bg_image1.png)',
	// 	backgroundSize: 'cover',
	// 	backgroundAttachment: 'fixed',
	// 	backgroundPosition: 'center center'
	// }} />

	return (
		<div data-groupid={"landing-section"} data-section="contact_us" className="relative" id="contact" style={{
			backgroundImage: 'url(/assets/images/bg_image1.png)',
			backgroundSize: 'cover',
			backgroundAttachment: 'fixed',
			backgroundPosition: 'center center'
		}}>
			<div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70" />
			<div className="relative text-primaryText landing-page-section font-diatype">
				<div className="grid gap-10 grid-cols-1 md:grid-cols-[1fr_500px]">
					<div className="hidden md:visible w-max-[300px] md:flex items-center">
						<Image className="h-[28rem]" src={IdeaSvg} alt={'Contact ArtiBot'} />
					</div>
					<div>
						<h3 className="text-3xl mb-6">Contact Us</h3>
						{contactData.formFields.map(formField => {
							return (
								<div key={formField.name} className="mb-3">
									<label className="text-sm text-secondaryText" htmlFor="">{formField.label} <span className="text-red-600">*</span></label>
									<formField.Input hasError={Boolean(showError && errors[formField.name])} value={values[formField.name]} onChange={e => onChange(formField.name, e.target.value)} />
								</div>
							)
						})}
						<button id={"contact-submit-id"} onClick={handleSubmit} disabled={false && errors && Object.keys(errors).length > 0} className="disabled:opacity-30 h-14 cta-button w-full flex items-center justify-center rounded-xl">
							{isSubmitting ? <Loader /> : <span>Submit</span>}
						</button>
					</div>
				</div>
				{snackBarData && <Snackbar/>}
			</div>
		</div>
	)
}
