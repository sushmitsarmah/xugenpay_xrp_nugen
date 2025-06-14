// src/services/userService.ts
import { func } from 'joi';
import { getSupabaseClient } from '../db/client';
import type { User } from '../types';

export async function upsertUser(user: Partial<User>) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('users')
        .upsert(user, { onConflict: 'wallet_address' })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getUserByUsername(username: string) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

    if (error) throw error;
    return data;
}

export async function getUserByWallet(wallet: string) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', wallet)
        .single();

    if (error) throw error;
    return data;
}

export async function getUsers() {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('users')
        .select('*');

    if (error) throw error;
    return data;
}

export async function searchUsersByUsername(query: string) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .ilike('username', `%${query}%`);

    if (error) throw error;
    return data;
}

export async function insertXummPayload(payload: any, orig_payload: any) {
    const supabase = getSupabaseClient();

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 360);

    const { data, error } = await supabase
        .from('xumm_payloads')
        .insert({
            uuid: payload.uuid,
            type: 'signin',
            status: 'pending',
            qr_png: payload.refs.qr_png,
            qr_matrix: payload.refs.qr_matrix,
            next_link: payload.refs.next.always,
            pushed: payload.pushed,
            expires_at: expiresAt.toISOString(),
            original_payload_details: orig_payload // Store original request type
        })
        .select()
        .single();

    if (error) {
        console.error('Supabase insert error for sign-in payload:', error);
        throw error;
    }

    return data;
};

export async function getXummPayloadByUuid(uuid: string) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('xumm_payloads')
        .select('*')
        .eq('uuid', uuid)
        .single();

    if (error) {
        console.error(`Error fetching payload ${uuid}:`, error);
        throw error;
    }
    return data;
};

export async function updateXummPayload(uuid: string, updateData: any) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('xumm_payloads')
        .update(updateData)
        .eq('uuid', uuid)
        .select()
        .single();

    if (error) {
        console.error(`Error updating payload ${uuid}`, error);
        throw error;
    }
    return data;
}