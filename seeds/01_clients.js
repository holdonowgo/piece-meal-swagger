exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('clients').del()
        .then(function() {
            return Promise.all([
                    // Inserts seed entries
                    knex('clients').insert([{
                        id: 1,
                        first_name: 'Marvin',
                        last_name: 'Gaye',
                        email: 'marvin.gaye@gmail.com',
                        image_url: `http://www.eurweb.com/wp-content/uploads/2016/11/marvin-gaye-2.jpg`,
                        is_super_user: false,
                        hashed_password: '$2a$12$C9AYYmcLVGYlGoO4vSZTPud9ArJwbGRsJ6TUsNULzR48z8fOnTXbS',
                        created_at: new Date('2016-06-29 14:26:16 UTC'),
                        updated_at: new Date('2016-06-29 14:26:16 UTC')
                    },
                    {
                        id: 2,
                        first_name: 'Al',
                        last_name: 'Green',
                        email: 'al.green@gmail.com',
                        image_url: `http://www.hirecords.com/assets/img/al-green.jpg`,
                        is_super_user: false,
                        hashed_password: '$2a$12$C9AYYmcLVGYlGoO4vSZTPud9ArJwbGRsJ6TUsNULzR48z8fOnTXbS',
                        created_at: new Date('2016-06-29 14:26:16 UTC'),
                        updated_at: new Date('2016-06-29 14:26:16 UTC')
                    },
                    {
                        id: 3,
                        first_name: 'Randall',
                        last_name: 'Spencer',
                        email: 'randy.spence@gmail.com',
                        image_url: `https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAbyAAAAJDdmOWM1MTgwLTc2NjYtNDQ4Yy05ZTM1LWQyMzhmZjkwN2FlYg.jpg`,
                        is_super_user: true,
                        hashed_password: '$2a$12$C9AYYmcLVGYlGoO4vSZTPud9ArJwbGRsJ6TUsNULzR48z8fOnTXbS',
                        created_at: new Date('2016-06-29 14:26:16 UTC'),
                        updated_at: new Date('2016-06-29 14:26:16 UTC')
                    },
                    {
                        id: 4,
                        first_name: 'Aom',
                        last_name: 'Sithanant',
                        email: 'aom.sithanant@gmail.com',
                        image_url: `https://media.licdn.com/mpr/mpr/shrink_200_200/AAEAAQAAAAAAAAtCAAAAJGE2YjFjMWRhLTBiY2MtNDgwMi04MTNiLTJjZTI0NWVkODg4Nw.jpg`,
                        is_super_user: true,
                        hashed_password: '$2a$12$C9AYYmcLVGYlGoO4vSZTPud9ArJwbGRsJ6TUsNULzR48z8fOnTXbS',
                        created_at: new Date('2016-06-29 14:26:16 UTC'),
                        updated_at: new Date('2016-06-29 14:26:16 UTC')
                    },
                    {
                        id: 5,
                        first_name: 'Michael',
                        last_name: 'Martinez',
                        email: 'michael.alberto.martinez@gmail.com',
                        image_url: `http://i.imgur.com/lL5Y56B.jpg`,
                        is_super_user: true,
                        hashed_password: '$2a$12$C9AYYmcLVGYlGoO4vSZTPud9ArJwbGRsJ6TUsNULzR48z8fOnTXbS',
                        created_at: new Date('2016-06-29 14:26:16 UTC'),
                        updated_at: new Date('2016-06-29 14:26:16 UTC')
                    }])
                ])
                .then((result) => {
                    return knex.raw("SELECT setval('clients_id_seq', (SELECT MAX(id) FROM clients));");
                });
        });
};
