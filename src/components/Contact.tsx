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



export default function Contact() {
	const {values, errors, reset, onChange} = useForm<ContactFormObject>({
		company: {value: '', validators: [Validators.isRequired]},
		email: {value: '', validators: [Validators.isRequired, Validators.isEmail]},
		full_name: {value: '', validators: [Validators.isRequired]},
		idea: {value: '', validators: [Validators.isRequired]},
		profession: {value: '', validators: [Validators.isRequired]}
	});
	const [snackBarData, setSnackBarData] = useContext(SnackbarContext).snackBarData;
	const [showError, setShowError] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	function isFormValid() {

	}

	async function handleSubmit() {
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

	return (
		<div className="text-primaryText landing-page-section font-diatype" id="contact">
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
					<button onClick={handleSubmit} disabled={errors && Object.keys(errors).length > 0} className="disabled:opacity-30 h-14 cta-button w-full flex items-center justify-center rounded-xl">
						{isSubmitting ? <Loader /> : <span>Submit</span>}
					</button>
				</div>
			</div>
			{snackBarData && <Snackbar/>}
		</div>
	)
}
