const db = require('../../db')

class PatientController {

  // ============================
  async createDocument(req, res) {
    const { surname, name, patronymic, sex, datebirth, adress, policynumber } = req.body
    const newPatient = await db.query(
      'INSERT INTO patient (surname, name, patronymic, sex, dateBirth, adress, policyNumber) values ($1, $2, $3,$4, $5, $6, $7) RETURNING *',
      [surname, name, patronymic, sex, datebirth, adress, policynumber]
    )
    res.json(newPatient.rows[0])
  }
  async getDocuments(req, res) {
    const patients = await db.query(
      'SELECT * FROM patient'
    )
    res.json(patients.rows)
  }

  // ============================
  async getOneDocument(req, res) {
    const id = req.params.id
    const patient = await db.query(
      'SELECT * FROM patient where id = $1', [id]
    )
    res.json(patient.rows[0])
  }

  // ============================
  async updateDocument(req, res) {
    const { id, surname, name, patronymic, sex, datebirth, adress, policynumber } = req.body
    const newPatient = await db.query(
      'UPDATE patient set surname = $1, name = $2, patronymic= $3, sex= $4, dateBirth= $5, adress= $6, policyNumber= $7 where id = $8 RETURNING *',
      [surname, name, patronymic, sex, datebirth, adress, policynumber, id]
    )
    res.json(newPatient.rows[0])
  }

  // ============================
  async deleteDocument(req, res) {
    const id = req.params.id
    const patient = await db.query(
      'DELETE FROM patient where id = $1', [id]
    )
    res.json(patient)
  }
}

module.exports = new PatientController()