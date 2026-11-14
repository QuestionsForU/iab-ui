import validateFormFields from './formValidation';

describe('validateFormFields', () => {
    it('returns required-field errors for missing values', () => {
        expect(validateFormFields({}, [
            { field: 'name', type: 'text', required: true },
        ])).toEqual({ name: 'Required field.' });
    });

    it('validates email and phone fields', () => {
        expect(validateFormFields({
            email: 'not-an-email',
            phone: '123',
        }, [
            { field: 'email', type: 'email' },
            { field: 'phone', type: 'phone' },
        ])).toEqual({
            email: 'Invalid email address.',
            phone: 'Invalid phone number.',
        });
    });

    it('validates fields nested inside areas', () => {
        expect(validateFormFields({}, [{
            type: 'area',
            fields: [{ field: 'email', type: 'email', required: true }],
        }])).toEqual({ email: 'Required field.' });
    });

    it('requires doctor designation only when the doctor role is selected', () => {
        const fields = [{ field: 'doctorDesignation', type: 'textarea', required: true, showWhenRole: 'Doctor' }];

        expect(validateFormFields({ roles: [{ name: 'Admin' }] }, fields)).toEqual({});
        expect(validateFormFields({ roles: [{ name: 'Doctor' }] }, fields)).toEqual({
            doctorDesignation: 'Required field.',
        });
        expect(validateFormFields({
            roles: [{ name: 'Doctor' }],
            doctorDesignation: 'Consultant Pathologist',
        }, fields)).toEqual({});
    });

    it('returns no errors for valid optional values', () => {
        expect(validateFormFields({
            email: 'user@example.com',
            phone: '+1 1234567890',
        }, [
            { field: 'email', type: 'email' },
            { field: 'phone', type: 'phone' },
        ])).toEqual({});
    });
});
