exports.up = (pgm) => {
  pgm.createTable('user_thread_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
  });

  pgm.addConstraint('user_thread_likes', 'unique_user_id_and_thread_id', 'UNIQUE(user_id, thread_id)');

  pgm.addConstraint('user_thread_likes', 'fk_user_thread_likes.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('user_thread_likes', 'fk_user_thread_likes.thread_id_threads.id', 'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('user_thread_likes');
};
