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
                        is_super_user: false,
                        hashed_password: '$2a$12$C9AYYmcLVGYlGoO4vSZTPud9ArJwbGRsJ6TUsNULzR48z8fOnTXbS', // youreawizard
                        created_at: new Date('2016-06-29 14:26:16 UTC'),
                        updated_at: new Date('2016-06-29 14:26:16 UTC')
                    },
                    {
                        id: 2,
                        first_name: 'Al',
                        last_name: 'Green',
                        email: 'al.green@gmail.com',
                        is_super_user: false,
                        hashed_password: '$2a$12$C9AYYmcLVGYlGoO4vSZTPud9ArJwbGRsJ6TUsNULzR48z8fOnTXbS', // youreawizard
                        created_at: new Date('2016-06-29 14:26:16 UTC'),
                        updated_at: new Date('2016-06-29 14:26:16 UTC')
                    },
                    {
                        id: 3,
                        first_name: 'Randall',
                        last_name: 'Spencer',
                        email: 'randy.spence@gmail.com',
                        is_super_user: true,
                        hashed_password: '$2a$12$C9AYYmcLVGYlGoO4vSZTPud9ArJwbGRsJ6TUsNULzR48z8fOnTXbS', // youreawizard
                        created_at: new Date('2016-06-29 14:26:16 UTC'),
                        updated_at: new Date('2016-06-29 14:26:16 UTC')
                    },
                    {
                        id: 4,
                        first_name: 'Aom',
                        last_name: 'Sithanant',
                        email: 'aom.sithanant@gmail.com',
                        is_super_user: true,
                        hashed_password: '$2a$12$C9AYYmcLVGYlGoO4vSZTPud9ArJwbGRsJ6TUsNULzR48z8fOnTXbS', // youreawizard
                        created_at: new Date('2016-06-29 14:26:16 UTC'),
                        updated_at: new Date('2016-06-29 14:26:16 UTC')
                    }])
                ])
                .then((result) => {
                    return knex.raw("SELECT setval('clients_id_seq', (SELECT MAX(id) FROM clients));");
                });
        });
};
