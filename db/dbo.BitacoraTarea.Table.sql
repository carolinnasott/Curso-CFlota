USE [SISEP_ControlFlota]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BitacoraTarea](
	[bitaId] [int] IDENTITY(1,1) NOT NULL,
	[bitaMobiId] [int] NULL,
	[bitaTareId] [int] NULL,
	[bitaObservaciones] [varchar](200) NULL,
	[bitaCantidad] [float] NULL,
	[bitaCosto] [float] NULL,
	[bitaFechaAlta] [datetime] NULL,
	[bitaBorrado] [bit] NOT NULL,
 CONSTRAINT [PK_BitacoraTarea] PRIMARY KEY CLUSTERED 
(
	[bitaId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
