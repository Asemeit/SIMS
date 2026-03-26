import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gopulvhbtzjrvphsbimc.supabase.co';
const supabaseKey = 'sb_publishable_ip9spstl-dOnGYALsU_45Q_kk80leH5';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedExpiry() {
    const today = new Date();
    
    const items = [
        {
            name: 'Fresh Cow Milk',
            sku: 'MILK-001',
            category: 'Beverages',
            quantity: 45,
            min_stock_level: 10,
            price: 2.5,
            expiry_date: new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000)).toISOString(), // 3 days
            status: 'In Stock'
        },
        {
            name: 'Whole Grain Bread',
            sku: 'BRD-442',
            category: 'Bakery',
            quantity: 12,
            min_stock_level: 5,
            price: 1.8,
            expiry_date: new Date(today.getTime() + (2 * 24 * 60 * 60 * 1000)).toISOString(), // 2 days
            status: 'In Stock'
        },
        {
            name: 'Greek Yogurt Pack',
            sku: 'YOG-998',
            category: 'Dairy',
            quantity: 8,
            min_stock_level: 10,
            price: 5.5,
            expiry_date: new Date(today.getTime() + (10 * 24 * 60 * 60 * 1000)).toISOString(), // 10 days
            status: 'Low Stock'
        }
    ];

    console.log('Seeding expiring items...');
    const { data, error } = await supabase.from('inventory').insert(items);
    
    if (error) {
        console.error('Error seeding:', error);
    } else {
        console.log('Successfully seeded expiring items.');
    }
}

seedExpiry();
