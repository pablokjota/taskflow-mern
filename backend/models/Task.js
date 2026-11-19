
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },

    descricao: {
      type: String,
      trim: true,
      default: '',
    },

    status: {
      type: String,
      enum: ['pendente', 'em andamento', 'concluida'],
      default: 'pendente',
    },

    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Task', taskSchema);
