import { Response } from 'express';
import { ApiResponse, ValidationErrorDetail } from '../types';

const success = <T>(res: Response, data: T, message: string = 'Success', status: number = 200): void => {
    res.status(status).json({
        success: true,
        message,
        data,
    } as ApiResponse<T>);
};

const error = (res: Response, message: string = 'An error occurred', status: number = 500, errors: ValidationErrorDetail[] | any = null): void => {
    res.status(status).json({
        success: false,
        message,
        errors,
    } as ApiResponse<null>);
};

export {
    success,
    error,
};
