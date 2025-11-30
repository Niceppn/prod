import React, { useEffect, useState } from 'react'
import './App.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function App() {
	const [name, setName] = useState('')
	const [height, setHeight] = useState('')
	const [weight, setWeight] = useState('')
	const [people, setPeople] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	useEffect(() => {
		fetchList()
	}, [])

	async function fetchList() {
		setLoading(true)
		setError('')
		try {
			const res = await fetch(`${API_BASE}/people`)
			if (!res.ok) throw new Error('Failed to fetch')
			const data = await res.json()
			setPeople(data)
		} catch (err) {
			setError(String(err.message || err))
		} finally {
			setLoading(false)
		}
	}

	async function handleSave(e) {
		e.preventDefault()
		setError('')
		if (!name || !height || !weight) {
			setError('กรุณากรอกทุกช่อง')
			return
		}

		try {
			const res = await fetch(`${API_BASE}/people`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, height, weight }),
			})
			if (!res.ok) {
				const body = await res.json().catch(() => ({}))
				throw new Error(body.error || 'บันทึกไม่สำเร็จ')
			}
			const created = await res.json()
			setPeople((p) => [...p, created])
			setName('')
			setHeight('')
			setWeight('')
		} catch (err) {
			setError(String(err.message || err))
		}
	}

	return (
		<div style={{ maxWidth: 720, margin: '24px auto', padding: 12 }}>
			<h1>บันทึกข้อมูลบุคคล</h1>

			<form onSubmit={handleSave} style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
				<label>
					ชื่อ
					<input value={name} onChange={(e) => setName(e.target.value)} />
				</label>
				<label>
					ส่วนสูง (cm)
					<input value={height} onChange={(e) => setHeight(e.target.value)} type="number" />
				</label>
				<label>
					น้ำหนัก (kg)
					<input value={weight} onChange={(e) => setWeight(e.target.value)} type="number" />
				</label>

				<div>
					<button type="submit">บันทึก</button>
				</div>
			</form>

			{error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}

			<h2>รายชื่อทั้งหมด</h2>
			{loading ? (
				<div>กำลังโหลด...</div>
			) : people.length === 0 ? (
				<div>ยังไม่มีข้อมูล</div>
			) : (
				<table style={{ width: '100%', borderCollapse: 'collapse' }}>
					<thead>
						<tr>
							<th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>ชื่อ</th>
							<th style={{ textAlign: 'right', borderBottom: '1px solid #ccc' }}>ส่วนสูง</th>
							<th style={{ textAlign: 'right', borderBottom: '1px solid #ccc' }}>น้ำหนัก</th>
						</tr>
					</thead>
					<tbody>
						{people.map((p) => (
							<tr key={p.id}>
								<td style={{ padding: '8px 0' }}>{p.name}</td>
								<td style={{ padding: '8px 0', textAlign: 'right' }}>{p.height}</td>
								<td style={{ padding: '8px 0', textAlign: 'right' }}>{p.weight}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	)
}
