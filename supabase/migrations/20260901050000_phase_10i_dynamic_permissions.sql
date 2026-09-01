-- Create role_permissions table
CREATE TABLE IF NOT EXISTS public.role_permissions (
    role TEXT PRIMARY KEY,
    permissions TEXT[] NOT NULL DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Only super_admins/owners should be able to view and modify, but we'll use our existing 
-- pattern where server actions bypass RLS by using the service_role key, or we can allow 
-- authenticated users to read it since permissions aren't secret (just controls).
CREATE POLICY "Allow read access to authenticated users" 
ON public.role_permissions FOR SELECT 
TO authenticated 
USING (true);

-- Insert default permissions
INSERT INTO public.role_permissions (role, permissions) VALUES
('owner', ARRAY[
    'dashboard.view',
    'orders.view',
    'orders.manage',
    'payments.view',
    'payments.refund',
    'products.view',
    'products.manage',
    'pricing.view',
    'pricing.manage',
    'customers.view',
    'settings.view',
    'users.view',
    'users.manage'
]),
('admin', ARRAY[
    'dashboard.view',
    'orders.view',
    'orders.manage',
    'payments.view',
    'payments.refund',
    'products.view',
    'products.manage',
    'pricing.view',
    'pricing.manage',
    'customers.view',
    'settings.view'
]),
('staff', ARRAY[
    'dashboard.view',
    'orders.view',
    'orders.manage',
    'customers.view'
]),
('customer', ARRAY[]::TEXT[])
ON CONFLICT (role) DO UPDATE SET
    permissions = EXCLUDED.permissions;
